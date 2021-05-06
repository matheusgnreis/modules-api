'use strict'

// log on files
const logger = require('console-files')

// authenticated REST client
const Api = require(process.cwd() + '/lib/Api')
// const { objectId } = require(process.cwd() + '/lib/Utils')

module.exports = (transactionBody, orderId, storeId, callback) => {
  // add transaction to order body
  // POST on transactions subresource
  const endpoint = 'orders/' + orderId + '/transactions.json'

  const errorCallback = err => {
    // debug with alert
    const msg = '!! CANNOT SAVE FOLLOWING TRANSACTION TO ORDER' +
              '\nOrder ID:' + orderId +
              '\nStore ID:' + storeId +
              '\nTransaction body:' +
              '\n' + JSON.stringify(transactionBody, null, 2)
    logger.error(new Error(msg))
    if (err) {
      logger.error(err)
    }
    callback(err)
  }

  Api(endpoint, 'POST', transactionBody, storeId, errorCallback, body => {
    callback(null, body._id)
  })
}
