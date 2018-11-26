'use strict'

// log on files
const logger = require('console-files')

// authenticated REST client
const Api = require(process.cwd() + '/lib/Api')
// const { objectId } = require(process.cwd() + '/lib/Utils')

module.exports = (order, storeId, errorCallback, successCallback) => {
  let returnOrder = body => {
    // return created order public data
    if (typeof successCallback === 'function') {
      successCallback(body)
    } else {
      // debug only
      logger.log(body)
    }
  }

  Api('orders.json', 'POST', order, storeId, errorCallback, body => {
    const orderId = body._id
    // GET public order object with some delay
    setTimeout(() => {
      let endpoint = 'orders/' + orderId + '.json'
      Api(endpoint, 'GET', null, storeId, errorCallback, returnOrder, true)
    }, 800)
  })
}
