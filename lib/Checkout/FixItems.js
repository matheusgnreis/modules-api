'use strict'

// log on files
const logger = require('console-files')

// authenticated REST client
const Api = require(process.cwd() + '/lib/Api')
const { objectId } = require(process.cwd() + '/lib/Utils')

module.exports = (items, storeId, callback) => {
  // get each cart item
  // count done processes
  let itemsDone = 0
  let itemsTodo = items.length
  let doFinally = () => {
    // after each item
    itemsDone++
    if (itemsDone === itemsTodo) {
      // logger.log('all items done')
      // logger.log(JSON.stringify(items, null, 2))
      // all items done
      if (typeof callback === 'function') {
        callback(items)
      } else {
        // debug only
        logger.log(items)
      }
    }
  }

  // run item by item
  for (let i = 0; i < items.length; i++) {
    // i, item scoped
    let item = items[i]

    let errorCallback = err => {
      if (err) {
        logger.error(err)
      }
      // remove cart item
      items.splice(i, 1)
      doFinally()
    }

    let successCallback = product => {
      // logger.log(err)
      // logger.log(product)
      if (!product.available) {
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
      doFinally()
    }

    // GET public product object
    let endpoint = 'products/' + item.product_id + '.json'
    // true for public API
    Api(endpoint, 'GET', null, storeId, errorCallback, successCallback, true)
  }
}
