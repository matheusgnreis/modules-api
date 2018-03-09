'use strict'

// log on files
const logger = require('./Logger.js')

// Node raw HTTP module with https protocol
const https = require('https')

// Store API
let host
let baseUri
let port

function requestEnd (res, rawData, callback, successCallback) {
  switch (res.statusCode) {
    case 201:
    case 200:
      successCallback()
      break

    case 412:
      // no store found with provided ID
      let msg = {
        'en_us': 'Invalid store ID',
        'pt_br': 'ID da loja inválido'
      }
      callback(new Error(msg.en_us), null, msg)
      break

    default:
      // unexpected status code
      let str = 'Unexpected response status code from Store API' +
        '\nStatus: ' + res.statusCode +
        '\nResponse: ' + rawData
      let err = new Error(str)
      logger.error(err)
      callback(err, null)
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

module.exports = (endpoint, method, body, storeId, callback, successCallback) => {
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

  let req = https.request(options, (res) => {
    if (callback !== undefined) {
      let rawData = ''
      res.setEncoding('utf8')
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        requestEnd(res, rawData, callback, () => {
          // OK
          let parsedData
          try {
            parsedData = JSON.parse(rawData)
          } catch (e) {
            logger.error(e)
            // callback without response body
            callback(e, null)
            return
          }

          // pass parsed JSON
          successCallback(parsedData)
        })
      })
    } else {
      // consume response data to free up memory
      res.resume()
    }
  })

  req.on('error', (e) => {
    logger.error(e)
  })

  if (body) {
    // write data to request body
    req.write(JSON.stringify(body))
  }
  req.end()
}
