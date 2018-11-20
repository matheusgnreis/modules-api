'use strict'

// log on files
const logger = require('console-files')

// Node raw HTTP module
const http = require('http')

// Store API
let host
let baseUri
let port

function requestEnd (res, rawData, errorCallback, successCallback) {
  switch (res.statusCode) {
    case 200:
    case 201:
    case 204:
      successCallback()
      break

    case 412:
      // no store found with provided ID
      errorCallback(null, 412, 'Invalid store ID')
      break

    default:
      // unexpected status code
      let str = 'Unexpected response status code from Store API' +
        '\nStatus: ' + res.statusCode +
        '\nResponse: ' + rawData
      let err = new Error(str)
      errorCallback(err)
  }
}

// read config file
require('./../lib/Config.js')((config) => {
  // config REST API
  host = config.apiHost
  if (!config.apiBaseUri) {
    // current Store API version
    baseUri = '/v1/'
  } else {
    baseUri = config.apiBaseUri
  }
  port = config.apiPort
})

module.exports = (endpoint, method, body, storeId, errorCallback, successCallback) => {
  let options = {
    hostname: host,
    path: baseUri + endpoint,
    method: method,
    headers: {
      'X-Store-ID': storeId
    }
  }
  if (port) {
    options.port = port
  }

  let req = http.request(options, (res) => {
    if (typeof errorCallback === 'function') {
      let rawData = ''
      res.setEncoding('utf8')
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        requestEnd(res, rawData, errorCallback, () => {
          // OK
          let parsedData
          try {
            parsedData = JSON.parse(rawData)
          } catch (e) {
            // not a valid JSON
            // callback without response body
            errorCallback(e)
            return
          }

          if (typeof successCallback === 'function') {
            // pass parsed JSON
            successCallback(parsedData)
          }
        })
      })
    } else {
      // consume response data to free up memory
      res.resume()
    }
  })

  req.on('error', (e) => {
    if (typeof errorCallback === 'function') {
      errorCallback(e)
    } else {
      // no callback
      // just log the unexpected error
      logger.error(e)
    }
  })

  if (body) {
    // write data to request body
    req.write(JSON.stringify(body))
  }
  req.end()
}
