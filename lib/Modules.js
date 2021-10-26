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

// write current request to file
const path = require('path')
const fs = require('fs')
let debugToFile = true
const tmpLogPathname = path.resolve(__dirname, '../tmp.log')

// blacklist urls to prevent consecultive errors
const blacklist = {}
let consecultiveAborts = 0

module.exports = (url, data, storeId, bigTimeout, cb, sessionRand) => {
  const blacklistKey = `${storeId}:${url}`
  if (blacklist[blacklistKey] > 2) {
    logger.log(`#${storeId} skipping blacklisted ${url}`)
    const err = new Error('Blacklited endpoint URL')
    if (typeof cb === 'function') {
      cb(err, null)
    }
    return
  }

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

  // debug request and response status
  const debug = response => {
    const status = response ? response.status : 0
    if (!blacklist[blacklistKey]) {
      blacklist[blacklistKey] = 1
    } else {
      blacklist[blacklistKey]++
    }
    setTimeout(() => {
      if (blacklist[blacklistKey] > 1) {
        blacklist[blacklistKey]--
      } else {
        delete blacklist[blacklistKey]
      }
    }, !status ? 180000 : 6000)

    let logLine = `#${storeId} - ${url} : ${status}`
    if (sessionRand) {
      logLine += ` [${sessionRand}]`
    }
    logger.log(logLine)
    if (status >= 400 && status < 500) {
      const { data } = response
      if (typeof data === 'object' && data !== null) {
        // also debug response data
        const { error, message } = data
        if (typeof error === 'string' && error.length && typeof message === 'string') {
          logger.log(JSON.stringify({ error, message }, null, 2))
        }
      }
    }

    if (debugToFile) {
      // debug current app request and response
      const logData = { reqOptions, status }
      if (response.data) {
        logData.response = response.data
      }
      fs.writeFile(
        tmpLogPathname,
        `\n${JSON.stringify(logData, null, 2)}\n\n${logLine}\n\n`,
        err => {
          if (err) {
            debugToFile = false
            setTimeout(() => {
              debugToFile = true
            }, 60000)
          }
        }
      )
    }
  }

  // run request with axios
  // parse promise to callback
  // returns the promise
  return axios(reqOptions)

    .then(response => {
      consecultiveAborts = 0
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
        if (err.code === 'ECONNABORTED') {
          consecultiveAborts++
          if (consecultiveAborts >= 50) {
            throw new Error(`Should restart on ${consecultiveAborts} consecutive req aborts`)
            // process.exit(1)
          }
        } else {
          consecultiveAborts = 0
        }
        let msg = 'Axios error ' + err.code + ': ' + err.message
        if (data) {
          // debug requet body
          msg += '\n\n' + JSON.stringify(data)
        }
        logger.log(msg)
      }
    })
}
