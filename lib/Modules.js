'use strict'

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

  // run request with axios
  let req = axios(options)
  if (typeof cb === 'function') {
    // parse promise to callback
    req.then(body => cb(null, body)).catch(err => cb(err))
  } else {
    // return promise
    return req
  }
}
