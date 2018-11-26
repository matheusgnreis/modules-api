'use strict'

// log on files
const logger = require('console-files')

// authenticated REST client
const Api = require(process.cwd() + '/lib/Api')
const { objectId } = require(process.cwd() + '/lib/Utils')

module.exports = (customer, storeId, callback) => {
  let noCustomer = err => {
    // cannot read or create order customer
    if (err) {
      logger.error(err)
    }
    // proceed order with a new random customer ID
    // customer saved on order only
    returnId(objectId())
  }

  let returnId = id => {
    if (typeof callback === 'function') {
      callback(id)
    } else {
      // debug only
      customer._id = id
      logger.log(customer)
    }
  }

  if (!customer._id) {
    // try to find customer by e-mail
    // GET customer object
    let endpoint = 'customers.json?fields=_id&main_email=' + customer.main_email
    Api(endpoint, 'GET', null, storeId, noCustomer, ({ result }) => {
      if (result.length) {
        // use first resulted customer ID
        returnId(result[0]._id)
      } else {
        // try to create new customer
        Api('customers.json', 'POST', customer, storeId, noCustomer, body => {
          // add created ID to order customer
          returnId(body._id)
        })
      }
    })
  } else {
    // customer ID already defined
    returnId(customer._id)
  }
}
