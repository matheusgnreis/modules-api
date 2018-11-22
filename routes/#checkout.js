'use strict'

// log on files
const logger = require('console-files')

// authenticated REST client
const Api = require('./../lib/Api')
const { objectId } = require('./../lib/Utils')

// handle other modules endpoints directly
const calculateShipping = require('./calculate_shipping').POST
const listPayments = require('./list_payments').POST
const createTransaction = require('./create_transaction').POST

// abstraction to calculate shipping and create transaction
const simulateRequest = (checkoutBody, checkoutRespond, label, storeId, callback) => {
  // logger.log(label)
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
    case 'transaction':
      moduleHandler = createTransaction
      moduleBody = checkoutBody.transaction
  }

  // mask request objects
  let reqId = null
  let reqMeta = {
    query: {
      app_id: moduleBody.app_id
    }
  }

  // mount request body with received checkout body object
  let reqBody = {
    items: checkoutBody.items
  }
  // additional data
  if (checkoutBody.amount) {
    reqBody.amount = checkoutBody.amount
    reqBody.subtotal = checkoutBody.amount.subtotal
  }
  if (checkoutBody.order_number) {
    reqBody.order_number = checkoutBody.order_number
  }
  Object.assign(reqBody, moduleBody)

  // handle response such as REST Auto Router
  // https://www.npmjs.com/package/rest-auto-router#callback-params
  let reqRespond = (obj, meta, statusCode, errorCode, devMsg) => {
    if (obj && !errorCode && typeof callback === 'function') {
      // OK
      callback(obj)
    } else {
      // pass the response
      checkoutRespond(obj, meta, statusCode, errorCode, devMsg)
    }
  }

  // simulate request to module endpoint
  moduleHandler(reqId, reqMeta, reqBody, reqRespond, storeId)
}

// filter modules response
const getModuleResult = results => {
  // results array returned from module
  // see ./#applications.js
  if (Array.isArray(results)) {
    for (let i = 0; i < results.length; i++) {
      if (results[i].validated) {
        // use it
        return results[i]
      }
    }
  }
  return null
}

module.exports = (checkoutBody, checkoutRespond, storeId) => {
  // valid body
  // handle checkout with shipping and transaction options
  // get each cart item first
  let items = checkoutBody.items
  let itemsDone = 0
  let itemsTodo = items.length
  for (let i = 0; i < items.length; i++) {
    let item = items[i]
    let callback = (err, product) => {
      // logger.log(err)
      // logger.log(product)

      if (err || !product.available) {
        // remove cart item
        items.splice(i, 1)
      } else {
        let body

        // check variation if any
        if (!item.variation_id) {
          body = product
        } else {
          // find respective variation
          let variation
          if (product.variations) {
            variation = product.variations.find(body => body._id === item.variation_id)
          }
          if (variation) {
            // merge product body with variation object
            body = Object.assign(product, variation)
          }
        }
        // logger.log(body._id)

        if (!body || body.min_quantity > item.quantity) {
          // cannot handle current item
          // invalid variation or quantity lower then minimum
          items.splice(i, 1)
        } else {
          // check quantity
          if (body.quantity < item.quantity) {
            // reduce to max available quantity
            item.quantity = body.quantity
          }

          // extend item properties with body
          ;[
            'sku',
            'name',
            'currency_id',
            'currency_symbol',
            'price',
            'dimensions',
            'weight'
          ].forEach(prop => {
            if (body.hasOwnProperty(prop)) {
              item[prop] = body[prop]
            }
          })
          // price is required
          if (!item.hasOwnProperty('price')) {
            item.price = 0
          }
          /*
          @TODO
          handle gift wrap and customizations before final price
          */
          item.final_price = item.price
          // random object ID for item
          item._id = objectId()
        }
      }

      itemsDone++
      if (itemsDone === itemsTodo) {
        // logger.log('all items done')
        // logger.log(JSON.stringify(items, null, 2))
        // all items done
        if (items.length) {
          // count subtotal value
          let subtotal = 0
          items.forEach(item => {
            subtotal += (item.final_price * item.quantity)
          })
          subtotal = Math.round(subtotal * 100) / 100
          let amount = {
            total: subtotal,
            subtotal
          }
          // also save to checkout body object
          checkoutBody.amount = amount

          // start mounting order body
          // https://developers.e-com.plus/docs/api/#/store/orders/orders
          let customer = checkoutBody.customer
          let orderBody = {
            items: items.slice(),
            buyers: [
              // received customer info
              customer
            ],
            amount
          }

          const createOrder = () => {
            let errorCallback = (err, statusCode, devMsg) => {
              // not successful API call
              let usrMsg = {
                en_us: 'There was a problem saving your order, please try again later',
                pt_br: 'Houve um problema ao salvar o pedido, por favor tente novamente mais tarde'
              }
              // send error response
              if (err) {
                logger.error(err)
                logger.log(orderBody)
                checkoutRespond({}, null, 500, 'CKT701', usrMsg)
              } else {
                if (typeof statusCode !== 'number') {
                  statusCode = 400
                }
                checkoutRespond({}, null, statusCode, 'CKT702', devMsg, usrMsg)
              }
            }

            const newOrder = () => {
              Api('orders.json', 'POST', orderBody, storeId, errorCallback, body => {
                const orderId = body._id
                let errorCallback = (err, statusCode, devMsg) => {
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

                // get order number from public order info
                let callback = (err, { number }) => {
                  if (!err) {
                    checkoutBody.order_number = number

                    // finally pass to create transaction
                    simulateRequest(checkoutBody, checkoutRespond, 'transaction', storeId, results => {
                      let result = getModuleResult(results)
                      if (result) {
                        // treat transaction response
                        let response = result.response
                        let transaction
                        if (response && (transaction = response.transaction)) {
                          // add transaction to order body
                          // POST on transactions subresource
                          let endpoint = 'orders/' + orderId + '/.json'

                          Api(endpoint, 'POST', transaction, storeId, errorCallback, body => {
                            // everithing done
                            // add transaction on order body object and respond
                            orderBody.transactions = [
                              Object.assign(response.transaction, body._id)
                            ]
                            checkoutRespond(orderBody)
                          })
                          return
                        }

                        errorCallback(null, null, 'No valid transaction object from /create_transaction')
                      }
                    })
                  } else {
                    errorCallback(null, null, 'Cannot GET the public order data')
                  }
                }

                // GET public order object with some delay
                setTimeout(() => {
                  let endpoint = 'orders/' + orderId + '.json'
                  Api(endpoint, 'GET', null, storeId, errorCallback, body => callback(null, body), true)
                }, 800)
              })
            }

            if (customer._id) {
              newOrder()
            } else {
              // must create customer first
              Api('customers.json', 'POST', customer, storeId, errorCallback, body => {
                // add customer ID to order and transaction
                customer._id = checkoutBody.transaction.buyer.customer_id = body._id
                newOrder()
              })
            }
          }

          // simulate requets to calculate shipping endpoint
          simulateRequest(checkoutBody, checkoutRespond, 'shipping', storeId, results => {
            let result = getModuleResult(results)
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
                    let freight = (shippingLine.total_price || shippingLine.price || 0)
                    amount.freight = freight
                    amount.total = subtotal + freight

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
                    listPayments()
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

          const listPayments = () => {
            // simulate requets to list payments endpoint
            simulateRequest(checkoutBody, checkoutRespond, 'payment', storeId, results => {
              let result = getModuleResult(results)
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
                        if (discount.type === 'percentual') {
                          amount.discount = maxDiscount * discount.value / 100
                        } else {
                          amount.discount = discount.value
                        }
                        if (amount.discount > maxDiscount) {
                          amount.discount = maxDiscount
                        }
                        amount.total -= amount.discount
                      }

                      // add to order body
                      orderBody.payment_method_label = paymentGateway.label || ''
                      // new order
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
      }
    }

    // GET public product object
    let endpoint = 'products/' + item.product_id + '.json'
    Api(endpoint, 'GET', null, storeId, err => callback(err), body => callback(null, body), true)
  }
}
