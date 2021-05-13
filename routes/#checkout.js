'use strict'

// deep objects clone util
const cloneDeep = require('lodash.clonedeep')
// log on files
const logger = require('console-files')

// checkout API parser libs
const fixItems = require('./../lib/Checkout/FixItems')
const getCustomerId = require('./../lib/Checkout/GetCustomerId')
const newOrder = require('./../lib/Checkout/NewOrder')
const saveTransaction = require('./../lib/Checkout/SaveTransaction')

// authenticated REST client
const Api = require('./../lib/Api')
const { objectId } = require('./../lib/Utils')

// handle other modules endpoints directly
const calculateShipping = require('./calculate_shipping').POST
const listPayments = require('./list_payments').POST
const applyDiscount = require('./apply_discount').POST
const createTransaction = require('./create_transaction').POST

// abstraction to calculate shipping and create transaction
const simulateRequests = (checkoutBody, checkoutRespond, label, storeId, callback) => {
  // select module to handle by label param
  let moduleHandler, moduleBodies
  switch (label) {
    case 'shipping':
      moduleHandler = calculateShipping
      moduleBodies = checkoutBody.shipping
      break
    case 'payment':
      moduleHandler = listPayments
      moduleBodies = checkoutBody.transaction
      break
    case 'discount':
      moduleHandler = applyDiscount
      moduleBodies = checkoutBody.discount
      break
    case 'transaction':
      moduleHandler = createTransaction
      moduleBodies = checkoutBody.transaction
  }
  if (!Array.isArray(moduleBodies)) {
    moduleBodies = [moduleBodies]
  }

  let countDone = 0
  const callbackObjs = []
  const handleCallback = obj => {
    countDone++
    callbackObjs.push(obj)
    if (countDone === moduleBodies.length) {
      callback(callbackObjs)
    }
  }

  let isResponseSent = false
  moduleBodies.forEach(moduleBody => {
    if (moduleBody && moduleBody.app_id) {
      // mask request objects
      const reqId = null
      const reqMeta = {
        query: {
          app_id: moduleBody.app_id
        }
      }
      // mount request body with received checkout body object
      const reqBody = cloneDeep({
        ...checkoutBody,
        ...moduleBody,
        is_checkout_confirmation: true
      })
      if (reqBody.amount && reqBody.amount_part > 0 && reqBody.amount_part < 1) {
        // fix amount for multiple transactions
        const partialAmount = reqBody.amount.total * reqBody.amount_part
        reqBody.amount.discount += reqBody.amount.total - partialAmount
        reqBody.amount.total = partialAmount
        delete reqBody.amount_part
      }

      // handle response such as REST Auto Router
      // https://www.npmjs.com/package/rest-auto-router#callback-params
      const reqRespond = (obj, meta, statusCode, errorCode, devMsg, usrMsg) => {
        if (obj && !errorCode && typeof callback === 'function') {
          // OK
          handleCallback(obj)
        } else if (!isResponseSent) {
          // pass the response
          devMsg = `Error on '${label}': ${devMsg} (${errorCode})`
          isResponseSent = true
          checkoutRespond(obj || {}, null, statusCode || 400, 'CKT900', devMsg, usrMsg)
        }
      }

      // simulate request to module endpoint
      moduleHandler(reqId, reqMeta, reqBody, reqRespond, storeId)
    } else {
      // ignore
      handleCallback()
    }
  })
}

// filter modules response
const getValidResults = (results, checkProp) => {
  // results array returned from module
  // see ./#applications.js
  const validResults = []
  if (Array.isArray(results)) {
    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      if (result.validated) {
        if (checkProp) {
          // validate one property from response object
          const responseProp = result.response[checkProp]
          if (!responseProp || (Array.isArray(responseProp) && !responseProp.length)) {
            // try next module result
            continue
          }
        }
        // use it
        validResults.push(result)
      }
    }
  }
  return validResults
}

module.exports = (checkoutBody, checkoutRespond, storeId) => {
  // valid body
  // handle checkout with shipping and transaction options
  // get each cart item first
  fixItems(checkoutBody.items, storeId, items => {
    // all items done
    if (items.length) {
      checkoutBody.items = items
      // start mounting order body
      // https://developers.e-com.plus/docs/api/#/store/orders/orders
      const customer = checkoutBody.customer
      const dateTime = new Date().toISOString()
      const orderBody = {
        opened_at: dateTime,
        buyers: [
          // received customer info
          customer
        ],
        items: []
      }
      // bypass some order fields
      ;[
        'utm',
        'affiliate_code',
        'browser_ip',
        'channel_id',
        'channel_type',
        'domain',
        'notes'
      ].forEach(field => {
        if (checkoutBody[field]) {
          orderBody[field] = checkoutBody[field]
        }
      })
      if (orderBody.domain) {
        // consider default Storefront app routes
        if (!orderBody.checkout_link) {
          orderBody.checkout_link = `https://${orderBody.domain}/app/#/checkout/(_id)`
        }
        if (!orderBody.status_link) {
          orderBody.status_link = `https://${orderBody.domain}/app/#/order/(_id)`
        }
      }

      // count subtotal value
      let subtotal = 0
      items.forEach(item => {
        subtotal += (item.final_price * item.quantity)
        // pass each item to prevent object overwrite
        orderBody.items.push(Object.assign({}, item))
      })
      const amount = {
        subtotal,
        discount: 0,
        freight: 0
      }

      const fixAmount = () => {
        for (const field in amount) {
          if (amount[field] > 0 && field !== 'total') {
            amount[field] = Math.round(amount[field] * 100) / 100
          }
        }
        amount.total = Math.round((amount.subtotal + amount.freight - amount.discount) * 100) / 100
        if (amount.total < 0) {
          amount.total = 0
        }
        // also save amount to checkout and order body objects
        checkoutBody.amount = amount
        orderBody.amount = amount
      }
      fixAmount()
      checkoutBody.subtotal = subtotal

      const createOrder = () => {
        // start creating new order to API
        getCustomerId(customer, storeId, customerId => {
          // add customer ID to order and transaction
          customer._id = checkoutBody.transaction.buyer.customer_id = customerId

          // handle new order
          const errorCallback = (err, statusCode, devMsg) => {
            // not successful API call
            const usrMsg = {
              en_us: 'There was a problem saving your order, please try again later',
              pt_br: 'Houve um problema ao salvar o pedido, por favor tente novamente mais tarde'
            }
            // send error response
            if (err) {
              logger.error(err)
              checkoutRespond({}, null, 409, 'CKT701', usrMsg)
            } else {
              if (typeof statusCode !== 'number') {
                statusCode = 400
              }
              checkoutRespond({}, null, statusCode, 'CKT702', devMsg, usrMsg)
            }
          }

          newOrder(orderBody, storeId, errorCallback, order => {
            const orderId = order._id
            const orderNumber = order.number

            const errorCallback = (err, statusCode, devMsg) => {
              // not successful API call
              const usrMsg = {
                en_us: 'Your order was saved, but we were unable to make the payment, ' +
                  'please contact us',
                pt_br: 'Seu pedido foi salvo, mas não conseguimos efetuar o pagamento, ' +
                  'por favor entre em contato'
              }
              // send error response
              if (err) {
                logger.error(err)
                checkoutRespond({}, null, 409, 'CKT703', null, usrMsg)
              } else {
                if (typeof statusCode !== 'number') {
                  statusCode = 409
                }
                checkoutRespond({}, null, statusCode, 'CKT704', devMsg, usrMsg)
              }
            }

            // logger.log('transaction')
            // logger.log(number)
            // merge objects to create transaction request body
            const transactionBody = {
              ...checkoutBody,
              order_id: orderId,
              order_number: orderNumber,
              // also need shipping address
              // send from shipping object if undefined on transaction object
              to: { ...checkoutBody.shipping.to },
              ...checkoutBody.transaction
            }
            // logger.log(JSON.stringify(transactionBody, null, 2))
            // logger.log(JSON.stringify(checkoutBody, null, 2))

            const cancelOrder = (staffNotes, errorMessage) => {
              setTimeout(() => {
                const body = {
                  status: 'cancelled',
                  staff_notes: staffNotes
                }
                if (errorMessage) {
                  body.staff_notes += ` - \`${errorMessage.substring(0, 200)}\``
                }
                Api('orders/' + orderId + '.json', 'PATCH', body, storeId)
              }, 400)
            }

            // finally pass to create transaction
            simulateRequests(transactionBody, checkoutRespond, 'transaction', storeId, responses => {
              let countDone = 0
              let paymentsAmount = 0

              for (let i = 0; i < responses.length; i++) {
                const results = responses[i]
                const isFirstTransaction = i === 0
                let isDone
                // logger.log(results)
                const validResults = getValidResults(results, 'transaction')
                for (let i = 0; i < validResults.length; i++) {
                  const result = validResults[i]
                  // treat transaction response
                  const response = result.response
                  let transaction
                  if (response && (transaction = response.transaction)) {
                    // complete transaction object with some request body fields
                    ;[
                      'type',
                      'payment_method',
                      'payer',
                      'currency_id',
                      'currency_symbol'
                    ].forEach(field => {
                      if (transactionBody[field] !== undefined && transaction[field] === undefined) {
                        transaction[field] = transactionBody[field]
                      }
                    })

                    // setup transaction app object
                    if (!transaction.app) {
                      transaction.app = { _id: result._id }
                      // complete app object with some request body fields
                      ;[
                        'label',
                        'icon',
                        'intermediator',
                        'payment_url'
                      ].forEach(field => {
                        if (checkoutBody.transaction[field] !== undefined) {
                          transaction.app[field] = checkoutBody.transaction[field]
                        }
                      })
                      // logger.log(transaction.app)
                    }

                    // check for transaction status
                    if (!transaction.status) {
                      transaction.status = {
                        current: 'pending'
                      }
                    }
                    transaction.status.updated_at = dateTime

                    if (isFirstTransaction) {
                      // merge transaction body with order info and respond
                      checkoutRespond({
                        order: {
                          _id: orderId,
                          number: orderNumber
                        },
                        transaction
                      })
                    }

                    // save transaction info on order data
                    saveTransaction(transaction, orderId, storeId, (err, transactionId) => {
                      if (!err) {
                        // add entry to payments history
                        const paymentEntry = {
                          transaction_id: transactionId,
                          status: transaction.status.current,
                          date_time: dateTime,
                          flags: ['checkout']
                        }
                        setTimeout(() => {
                          Api('orders/' + orderId + '/payments_history.json', 'POST', paymentEntry, storeId)
                        }, 300)
                      }
                    })
                    isDone = true
                    paymentsAmount += transaction.amount
                    break
                  }
                }

                if (isDone) {
                  countDone++
                  if (countDone === responses.length) {
                    if (amount.total / paymentsAmount > 1.01) {
                      cancelOrder('Transaction amounts doesn\'t match (is lower) order total value')
                    }
                  }
                  continue
                }

                // unexpected response object from create transaction module
                const firstResult = results && results[0]
                let errorMessage
                if (firstResult) {
                  const { response } = firstResult
                  if (response) {
                    // send devMsg with app response
                    if (response.message) {
                      errorMessage = response.message
                      if (response.error) {
                        errorMessage += ` (${response.error})`
                      }
                    } else {
                      errorMessage = JSON.stringify(response)
                    }
                  } else {
                    errorMessage = firstResult.error_message
                  }
                }
                if (isFirstTransaction) {
                  errorCallback(null, null, errorMessage || 'No valid transaction object')
                }
                cancelOrder('Error trying to create transaction', errorMessage)
                break
              }
            })
          })
        })
      }

      // simulate requets to calculate shipping endpoint
      simulateRequests(checkoutBody, checkoutRespond, 'shipping', storeId, ([results]) => {
        const validResults = getValidResults(results, 'shipping_services')
        for (let i = 0; i < validResults.length; i++) {
          const result = validResults[i]
          // treat calculate shipping response
          const response = result.response
          if (response && response.shipping_services) {
            // check chosen shipping code
            const shippingCode = checkoutBody.shipping.service_code

            for (let i = 0; i < response.shipping_services.length; i++) {
              const shippingService = response.shipping_services[i]
              const shippingLine = shippingService.shipping_line
              if (shippingLine && (!shippingCode || shippingCode === shippingService.service_code)) {
                // update amount freight and total
                let freight = typeof shippingLine.total_price === 'number'
                  ? shippingLine.total_price
                  : typeof shippingLine.price === 'number'
                    ? shippingLine.price
                    : 0
                if (isNaN(freight) || freight < 0) {
                  freight = 0
                }
                amount.freight = freight
                fixAmount()

                // app info
                const shippingApp = {
                  app: Object.assign({ _id: result._id }, shippingService)
                }
                // remove shipping line property
                delete shippingApp.app.shipping_line

                if (shippingLine.delivery_time) {
                  // sum production time to shipping deadline
                  let maxProductionDays = 0
                  orderBody.items.forEach(item => {
                    const productionTime = item.production_time
                    if (productionTime) {
                      let productionDays = productionTime.days
                      if (productionDays && productionTime.cumulative) {
                        productionDays *= item.quantity
                      }
                      if (productionDays > productionTime.max_time) {
                        productionDays = productionTime.max_time
                      }
                      if (maxProductionDays < productionDays) {
                        maxProductionDays = productionDays
                      }
                    }
                  })
                  if (maxProductionDays) {
                    shippingLine.delivery_time.days += maxProductionDays
                  }
                }

                // add to order body
                orderBody.shipping_lines = [
                  // generate new object id and compose shipping line object
                  Object.assign({ _id: objectId() }, shippingApp, shippingLine)
                ]
                orderBody.shipping_method_label = shippingService.label || ''

                // continue to discount step
                applyDiscount()
                return
              }
            }
          }
        }

        // problem with shipping response object
        const usrMsg = {
          en_us: 'Shipping method not available, please choose another',
          pt_br: 'Forma de envio indisponível, por favor escolha outra'
        }
        const devMsg = 'Any valid shipping service from /calculate_shipping module'
        checkoutRespond({}, null, 400, 'CKT901', devMsg, usrMsg)
      })

      const applyDiscount = () => {
        // simulate request to apply discount endpoint to get extra discount value
        simulateRequests(checkoutBody, checkoutRespond, 'discount', storeId, ([results]) => {
          const validResults = getValidResults(results)
          for (let i = 0; i < validResults.length; i++) {
            const result = validResults[i]
            // treat apply discount response
            const response = result.response
            if (response && response.discount_rule) {
              // check discount value
              const discountRule = response.discount_rule
              const extraDiscount = discountRule.extra_discount

              if (extraDiscount && extraDiscount.value) {
                // update amount and save extra discount to order body
                amount.discount += extraDiscount.value
                fixAmount()
                orderBody.extra_discount = {
                  ...checkoutBody.discount,
                  ...extraDiscount,
                  // app info
                  app: {
                    ...discountRule,
                    _id: result._id
                  }
                }

                if (response.freebie_product_ids) {
                  // mark items provided for free
                  orderBody.items.forEach(item => {
                    if (!item.flags) {
                      item.flags = []
                    }
                    if (response.freebie_product_ids.includes(item.product_id)) {
                      item.flags.push('discount-set-free')
                    }
                  })
                }
                break
              }
            }
          }

          // proceed to list payments
          listPayments()
        })
      }

      const listPayments = () => {
        // simulate requets to list payments endpoint
        simulateRequests(checkoutBody, checkoutRespond, 'payment', storeId, ([results]) => {
          const validResults = getValidResults(results, 'payment_gateways')
          for (let i = 0; i < validResults.length; i++) {
            const result = validResults[i]
            // treat list payments response
            const response = result.response
            if (response && response.payment_gateways) {
              // check chosen payment method code and name
              let paymentMethodCode, paymentMethodName
              if (checkoutBody.transaction.payment_method) {
                paymentMethodCode = checkoutBody.transaction.payment_method.code
                paymentMethodName = checkoutBody.transaction.payment_method.name
              }

              // filter gateways by method code
              const possibleGateways = response.payment_gateways.filter(paymentGateway => {
                const paymentMethod = paymentGateway.payment_method
                return !paymentMethodCode || (paymentMethod && paymentMethod.code === paymentMethodCode)
              })
              let paymentGateway
              if (possibleGateways.length > 1 && paymentMethodName) {
                // prefer respective method name
                paymentGateway = possibleGateways.find(paymentGateway => {
                  return paymentGateway.payment_method.name === paymentMethodName
                })
              }
              if (!paymentGateway) {
                paymentGateway = possibleGateways[0]
              }

              if (paymentGateway) {
                const discount = paymentGateway.discount
                let maxDiscount

                // handle discount by payment method
                if (discount && discount.apply_at && (maxDiscount = amount[discount.apply_at])) {
                  // update amount discount and total
                  let discountValue
                  if (discount.type === 'percentage') {
                    discountValue = maxDiscount * discount.value / 100
                  } else {
                    discountValue = discount.value
                    if (discountValue > maxDiscount) {
                      discountValue = maxDiscount
                    }
                  }
                  amount.discount += discountValue
                  fixAmount()
                }
                // add to order body
                orderBody.payment_method_label = paymentGateway.label || ''

                // finally start creating new order
                createOrder()
                return
              }
            }
          }

          // problem with list payments response object
          const usrMsg = {
            en_us: 'Payment method not available, please choose another',
            pt_br: 'Forma de pagamento indisponível, por favor escolha outra'
          }
          const devMsg = 'Any valid payment gateway from /list_payments module'
          checkoutRespond({}, null, 400, 'CKT902', devMsg, usrMsg)
        })
      }
    } else {
      // no valid items
      const devMsg = 'Cannot handle checkout, any valid cart item'
      checkoutRespond({}, null, 400, 'CKT801', devMsg)
    }
  })
}
