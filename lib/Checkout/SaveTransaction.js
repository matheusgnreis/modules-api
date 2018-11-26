'use strict'

// log on files
const logger = require('console-files')

// authenticated REST client
const Api = require(process.cwd() + '/lib/Api')
// const { objectId } = require(process.cwd() + '/lib/Utils')

module.exports = (transactionBody, orderId, storeId) => {
  // add transaction to order body
  // POST on transactions subresource
  let endpoint = 'orders/' + orderId + '/transactions.json'

  Api(endpoint, 'POST', transactionBody, storeId, err => {
    // debug with alert
    let msg = '!! CANNOT SAVE FOLLOWING TRANSACTION TO ORDER' +
              '\nOrder ID:' + orderId +
              '\nStore ID:' + storeId +
              '\nTransaction' + transactionBody
    logger.error(new Error(msg))
    if (err) {
      logger.error(err)
    }
  })
}
