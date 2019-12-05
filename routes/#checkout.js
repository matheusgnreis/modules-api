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
const simulateRequest = (checkoutBody, checkoutRespond, label, storeId, callback) => {
  // select module to handle by label param
  let moduleHandler, moduleBody
  switch (label) {
    case 'shipping':
      moduleHandler = calculateShipping
      moduleBody = checkoutBody.shipping
      break
    case 'payment':
      moduleHandler = listPayments
      moduleBody = checkoutBody.transaction
      break
    case 'discount':
      moduleHandler = applyDiscount
      moduleBody = checkoutBody.discount
      break
    case 'transaction':
      moduleHandler = createTransaction
      moduleBody = checkoutBody.transaction
  }

  if (moduleBody && moduleBody.app_id) {
    // mask request objects
    let reqId = null
    let reqMeta = {
      query: {
        app_id: moduleBody.app_id
      }
    }
    // mount request body with received checkout body object
    let reqBody = cloneDeep({
      ...checkoutBody,
      ...moduleBody,
      is_checkout_confirmation: true
    })
    // handle response such as REST Auto Router
    // https://www.npmjs.com/package/rest-auto-router#callback-params
    let reqRespond = (obj, meta, statusCode, errorCode, devMsg, usrMsg) => {
      if (obj && !errorCode && typeof callback === 'function') {
        // OK
        callback(obj)
      } else {
        // pass the response
        devMsg = `Error on '${label}': ${devMsg} (${errorCode})`
        checkoutRespond(obj || {}, null, statusCode || 400, 'CKT900', devMsg, usrMsg)
      }
    }

    // simulate request to module endpoint
    moduleHandler(reqId, reqMeta, reqBody, reqRespond, storeId)
  } else {
    // ignore
    callback()
  }
}

// filter modules response
const getModuleResult = (results, checkProp) => {
  // results array returned from module
  // see ./#applications.js
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
        return result
      }
    }
  }
  return null
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
      let customer = checkoutBody.customer
      let orderBody = {
        buyers: [
          // received customer info
          customer
        ],
        items: []
      }

      // count subtotal value
      let subtotal = 0
      items.forEach(item => {
        subtotal += (item.final_price * item.quantity)
        // pass each item to prevent object overwrite
        orderBody.items.push(Object.assign({}, item))
      })
      subtotal = Math.round(subtotal * 100) / 100
      let amount = {
        total: subtotal,
        subtotal,
        discount: 0,
        freight: 0
      }
      let fixTotal = () => {
        amount.total = amount.subtotal + amount.freight - amount.discount
        if (amount.total < 0) {
          amount.total = 0
        }
      }
      // also save amount to checkout and order body objects
      checkoutBody.subtotal = subtotal
      checkoutBody.amount = amount
      orderBody.amount = amount

      const createOrder = () => {
        // start creating new order to API
        getCustomerId(customer, storeId, customerId => {
          // add customer ID to order and transaction
          customer._id = checkoutBody.transaction.buyer.customer_id = customerId

          // handle new order
          const errorCallback = (err, statusCode, devMsg) => {
            // not successful API call
            let usrMsg = {
              en_us: 'There was a problem saving your order, please try again later',
              pt_br: 'Houve um problema ao salvar o pedido, por favor tente novamente mais tarde'
            }
            // send error response
            if (err) {
              logger.error(err)
              checkoutRespond({}, null, 500, 'CKT701', usrMsg)
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
              let usrMsg = {
                en_us: 'Your order was saved, but we were unable to make the payment, ' +
                  'please contact us',
                pt_br: 'Seu pedido foi salvo, mas não conseguimos efetuar o pagamento, ' +
                  'por favor entre em contato'
              }
              // send error response
              if (err) {
                logger.error(err)
                checkoutRespond({}, null, 500, 'CKT703', null, usrMsg)
              } else {
                if (typeof statusCode !== 'number') {
                  statusCode = 500
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

            // finally pass to create transaction
            simulateRequest(transactionBody, checkoutRespond, 'transaction', storeId, results => {
              // logger.log(results)
              let result = getModuleResult(results, 'transaction')
              if (result) {
                // treat transaction response
                let response = result.response
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
                    if (transactionBody.hasOwnProperty(field) && !transaction.hasOwnProperty(field)) {
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
                      if (checkoutBody.transaction.hasOwnProperty(field)) {
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
                  // merge transaction body with order info and respond
                  checkoutRespond({
                    order: {
                      _id: orderId,
                      number: orderNumber
                    },
                    transaction
                  })
                  // save transaction info on order data
                  saveTransaction(transaction, orderId, storeId)

                  // add entry to payments history
                  setTimeout(() => {
                    const body = {
                      status: transaction.status.current,
                      date_time: new Date().toISOString(),
                      flags: ['checkout']
                    }
                    Api('orders/' + orderId + '/payments_history.json', 'POST', body, storeId)
                  }, 400)
                  return
                }
              }

              // unexpected response object from create transaction module
              errorCallback(null, null, 'No valid transaction object from /create_transaction')

              // cancel the created order
              setTimeout(() => {
                const body = {
                  status: 'cancelled',
                  staff_notes: 'Error trying to create transaction'
                }
                Api('orders/' + orderId + '.json', 'PATCH', body, storeId)
              }, 400)
            })
          })
        })
      }

      // simulate requets to calculate shipping endpoint
      simulateRequest(checkoutBody, checkoutRespond, 'shipping', storeId, results => {
        let result = getModuleResult(results, 'shipping_services')
        if (result) {
          // treat calculate shipping response
          let response = result.response
          if (response && response.shipping_services) {
            // check chosen shipping code
            let shippingCode = checkoutBody.shipping.service_code

            for (let i = 0; i < response.shipping_services.length; i++) {
              let shippingService = response.shipping_services[i]
              let shippingLine = shippingService.shipping_line
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
                fixTotal()

                // app info
                let shippingApp = {
                  app: Object.assign({ _id: result._id }, shippingService)
                }
                // remove shipping line property
                delete shippingApp.app.shipping_line

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
        let usrMsg = {
          en_us: 'Shipping method not available, please choose another',
          pt_br: 'Forma de envio indisponível, por favor escolha outra'
        }
        let devMsg = 'Any valid shipping service from /calculate_shipping module'
        checkoutRespond({}, null, 400, 'CKT901', devMsg, usrMsg)
      })

      const applyDiscount = () => {
        // simulate request to apply discount endpoint to get extra discount value
        simulateRequest(checkoutBody, checkoutRespond, 'discount', storeId, results => {
          let result = getModuleResult(results)
          if (result) {
            // treat apply discount response
            let response = result.response
            if (response && response.discount_rule) {
              // check discount value
              const discountRule = response.discount_rule
              const extraDiscount = discountRule.extra_discount

              if (extraDiscount && extraDiscount.value) {
                // update amount and save extra discount to order body
                amount.discount += extraDiscount.value
                fixTotal()
                orderBody.extra_discount = {
                  ...checkoutBody.discount,
                  ...extraDiscount,
                  // app info
                  app: {
                    ...discountRule,
                    _id: result._id
                  }
                }
              }
            }
          }

          // proceed to list payments anyway
          listPayments()
        })
      }

      const listPayments = () => {
        // simulate requets to list payments endpoint
        simulateRequest(checkoutBody, checkoutRespond, 'payment', storeId, results => {
          let result = getModuleResult(results, 'payment_gateways')
          if (result) {
            // treat list payments response
            let response = result.response
            if (response && response.payment_gateways) {
              // check chosen payment method code
              let paymentMethodCode
              if (checkoutBody.transaction.payment_method) {
                paymentMethodCode = checkoutBody.transaction.payment_method.code
              }

              for (let i = 0; i < response.payment_gateways.length; i++) {
                let paymentGateway = response.payment_gateways[i]
                let paymentMethod = paymentGateway.payment_method
                if (!paymentMethodCode || (paymentMethod && paymentMethod.code === paymentMethodCode)) {
                  let discount = paymentGateway.discount
                  let maxDiscount

                  // handle discount by payment method
                  if (discount && discount.apply_at && (maxDiscount = amount[discount.apply_at])) {
                    // update amount discount and total
                    if (discount.type === 'percentage') {
                      amount.discount = maxDiscount * discount.value / 100
                    } else {
                      amount.discount = discount.value
                    }
                    if (amount.discount > maxDiscount) {
                      amount.discount = maxDiscount
                    }
                    fixTotal()
                  }
                  // add to order body
                  orderBody.payment_method_label = paymentGateway.label || ''

                  // finally start creating new order
                  createOrder()
                  return
                }
              }
            }
          }

          // problem with list payments response object
          let usrMsg = {
            en_us: 'Payment method not available, please choose another',
            pt_br: 'Forma de pagamento indisponível, por favor escolha outra'
          }
          let devMsg = 'Any valid payment gateway from /list_payments module'
          checkoutRespond({}, null, 400, 'CKT902', devMsg, usrMsg)
        })
      }
    } else {
      // no valid items
      let devMsg = 'Cannot handle checkout, any valid cart item'
      checkoutRespond({}, null, 400, 'CKT801', devMsg)
    }
  })
}
