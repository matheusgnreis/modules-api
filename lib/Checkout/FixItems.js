'use strict'

// log on files
const logger = require('console-files')

// authenticated REST client
const Api = require(process.cwd() + '/lib/Api')
const { objectId, getPrice } = require(process.cwd() + '/lib/Utils')

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
    let removeItem = function () {
      // remove invalid item from list
      items.splice(i, 1)
      doFinally()
    }
    if (!item.quantity) {
      // ignore items without quantity or zero
      removeItem()
      i--
      continue
    }

    let errorCallback = err => {
      if (err) {
        logger.error(err)
      }
      // remove cart item
      removeItem()
    }

    let successCallback = product => {
      // logger.log(err)
      // logger.log(product)
      if (!product.available) {
        removeItem()
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
          removeItem()
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

          const proceedItem = () => {
            // additions to final price
            if (Array.isArray(item.customizations)) {
              item.customizations.forEach(customization => {
                if (customization.add_to_price) {
                  const { type, addition } = customization.add_to_price
                  item.final_price += type === 'fixed'
                    ? addition
                    : item.price * addition / 100
                }
              })
            }

            /*
            @TODO handle gift wrap
            */

            // random object ID for item
            item._id = objectId()
            // done
            doFinally()
          }

          if (item.kit_product) {
            // GET public kit product object
            const kitProductId = item.kit_product._id
            let endpoint = 'products/' + kitProductId + '.json'

            const successCallback = kitProduct => {
              if (kitProduct.available && kitProduct.kit_composition) {
                // check kit composition and quantities
                let packQuantity = 0
                let isFixedQuantity = true
                let kitItem

                kitProduct.kit_composition.forEach(currentKitItem => {
                  if (currentKitItem.quantity) {
                    packQuantity += currentKitItem.quantity
                  } else if (isFixedQuantity) {
                    isFixedQuantity = false
                  }
                  if (currentKitItem._id === item.product_id) {
                    kitItem = currentKitItem
                  }
                })
                if (!isFixedQuantity) {
                  // use parent product min quantity
                  packQuantity = kitProduct.min_quantity
                }

                if (kitItem && (kitItem.quantity === undefined || item.quantity % kitItem.quantity === 0)) {
                  // valid kit item and quantity
                  let kitTotalQuantity = 0
                  items.forEach(item => {
                    if (item.kit_product && item.kit_product._id === kitProductId) {
                      kitTotalQuantity += item.quantity
                    }
                  })

                  const minPacks = kitItem.quantity
                    ? item.quantity / kitItem.quantity
                    : 1
                  if (kitTotalQuantity && kitTotalQuantity % (minPacks * packQuantity) === 0) {
                    // matched pack quantity
                    item.kit_product.price = getPrice(kitProduct)
                    item.kit_product.pack_quantity = packQuantity
                    if (kitProduct.slug) {
                      item.slug = kitProduct.slug
                    }
                    if (item.kit_product.price) {
                      // set final price from kit
                      item.final_price = item.kit_product.price / packQuantity
                    }
                    return proceedItem()
                  }
                }
              }

              // remove items with invalid kit
              let i = 0
              while (i < items.length) {
                if (items[i].kit_product && items[i].kit_product._id === kitProductId) {
                  items.splice(i, 1)
                } else {
                  i++
                }
              }
              doFinally()
            }

            // true for public API
            Api(endpoint, 'GET', null, storeId, errorCallback, successCallback, true)
          } else {
            // preset final price
            item.final_price = getPrice(body)
            proceedItem()
          }
        }
      }
    }

    // GET public product object
    let endpoint = 'products/' + item.product_id + '.json'
    // true for public API
    Api(endpoint, 'GET', null, storeId, errorCallback, successCallback, true)
  }
}
