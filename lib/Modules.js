'use strict'

// log on files
const logger = require('console-files')

// axios HTTP client
// https://github.com/axios/axios
const axios = require('axios')
// preset axios options
const options = {
  'method': 'POST',
  'headers': {},
  'maxRedirects': 2,
  'responseType': 'json',
  // max 300kb
  'maxContentLength': 300000
}

module.exports = (url, body, storeId, bigTimeout, cb) => {
  // edit request options
  options.url = url
  options.headers['X-Store-ID'] = storeId
  options.data = body
  // wait 10s by default and 30s in some cases
  options.timeout = bigTimeout ? 30000 : 10000

  // log the response status code
  const debug = (response) => {
    let status = response ? response.status : 0
    logger.log('#' + storeId + ' - ' + url + ' : ' + status)
  }

  // run request with axios
  let req = axios(options)
  // parse promise to callback
  // returns the promise
  return req.then(response => {
    debug(response)
    if (typeof cb === 'function') {
      cb(null, response.data)
    }
  }).catch(err => {
    debug(err.response)
    if (typeof cb === 'function') {
      cb(err)
    }
  })
}
