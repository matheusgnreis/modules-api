'use strict'

// NodeJS filesystem module
const fs = require('fs')

let callbacks = []
// delay to be sure all callbacks are set
setTimeout(() => {
  // read config file
  fs.readFile(process.cwd() + '/config/config.json', 'utf8', (err, data) => {
    if (err) {
      // can't read config file
      throw err
    } else if (typeof callback === 'function') {
      let config = JSON.parse(data)
      // run all callback functions
      for (let i = 0; i < callbacks.length; i++) {
        callbacks[i](config)
      }
    }
  })
}, 400)

module.exports = function (cb) {
  if (typeof cb === 'function') {
    callbacks.push(cb)
  }
}
