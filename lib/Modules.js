'use strict'

// log on files
const logger = require('console-files')

// axios HTTP client
// https://github.com/axios/axios
const axios = require('axios')
// preset axios options
const baseOptions = {
  method: 'POST',
  maxRedirects: 2,
  responseType: 'json',
  // max 1mb
  maxContentLength: 1000000
}

module.exports = (url, data, storeId, bigTimeout, cb) => {
  // setup request options
  const reqOptions = Object.assign({}, baseOptions, {
    url,
    data,
    headers: {
      'X-Store-ID': storeId
    },
    // wait 10s by default and 30s in some cases
    timeout: bigTimeout ? 30000 : 10000
  })

  // log the response status code
  const debug = (response) => {
    let status = response ? response.status : 0
    logger.log('#' + storeId + ' - ' + url + ' : ' + status)
  }

  // run request with axios
  // parse promise to callback
  // returns the promise
  return axios(reqOptions)

    .then(response => {
      debug(response)
      if (typeof cb === 'function') {
        cb(null, response.data)
      }
    })

    .catch(err => {
      // error handling
      const { response } = err
      debug(response)
      if (typeof cb === 'function') {
        const data = (response && response.data)
        cb(err, data)
      }

      // debug axios error object
      if (err.message || err.code) {
        let msg = 'Axios error ' + err.code + ': ' + err.message
        if (data) {
          // debug requet body
          msg += '\n' + JSON.stringify(data)
        }
        logger.log(msg)
      }
    })
}
