'use strict'

// log on files
const logger = require('./Logger.js')

// modules HTTP interface
let host, port
// HTTP client
let client
// limit response size, 100kb
const maxBytes = 100 * 1024

// read config file
require('./../lib/Config.js')((config) => {
  // config HTTP client
  host = config.modulesHost
  port = config.modulesPort
  if (!config.modulesHostTLS) {
    // Node raw HTTP module
    client = require('http')
  } else {
    // Node raw HTTP module with https protocol
    client = require('https')
  }
})

module.exports = (pkgId, pkgVersion, body, storeId, callback) => {
  let options = {
    hostname: host,
    path: pkgId + '/' + pkgVersion + '/pkg.php',
    method: 'POST',
    headers: {
      'X-Store-ID': storeId
    }
  }
  if (port) {
    options.port = port
  }

  let req = client.request(options, (res) => {
    if (typeof callback === 'function') {
      let rawData = ''
      let totalBytes
      res.setEncoding('utf8')
      res.on('data', (chunk) => {
        totalBytes += chunk.length
        if (totalBytes <= maxBytes) {
          rawData += chunk
        } else {
          // response size exceeds max size
          let err = new Error('Response exceeds max ' + maxBytes + ' bytes size')
          callback(err)
          // stop processing
          res.resume()
        }
      })
      res.on('end', () => {
        // done
        let parsedData, err
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            // success
            parsedData = JSON.parse(rawData)
          }
        } catch (e) {
          err = e
        } finally {
          callback(err, rawData, parsedData)
        }
      })
    } else {
      // consume response data to free up memory
      res.resume()
    }
  })

  req.on('error', (e) => {
    if (typeof callback === 'function') {
      callback(e)
    } else {
      // no callback
      // just log the unexpected error
      logger.error(e)
    }
  })

  // write data to request body
  req.write(JSON.stringify(body))
  req.end()
}
