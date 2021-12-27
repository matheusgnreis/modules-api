'use strict'

exports.objectId = () => {
  // generate new random object ID
  return (
    'e' +
    (Math.floor(Math.random() * (999999 - 10000)) + 10000) +
    'a' +
    Date.now()
  ).padEnd(24, '1')
}

const checkOnPromotion = product => {
  if (typeof product !== 'object' || product === null) {
    // prevent fatal error
    console.error(new Error('`product` must be an object'))
    return false
  }

  const promoDates = product.price_effective_date
  if (promoDates) {
    const now = new Date()
    if (promoDates.start) {
      // start date and time in ISO 8601
      if (new Date(promoDates.start) > now) {
        return false
      }
    }
    if (promoDates.end) {
      // promotion end date and time in ISO 8601
      if (new Date(promoDates.end) < now) {
        return false
      }
    }
  }
  // default to no promotion
  return !!(product.base_price > product.price)
}

exports.checkOnPromotion = checkOnPromotion

exports.getPrice = product => checkOnPromotion(product)
  // promotional sale price
  ? product.price
  : product
    // test final price for cart item object
    ? typeof product.final_price === 'number'
        ? product.final_price
        // use the maximum value between sale and base price
        : Math.max(product.base_price || 0, product.price || 0)
    // default to zero
    : 0
