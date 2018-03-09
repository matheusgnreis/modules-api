'use strict'

// log on files
// const logger = require('./../lib/Logger.js')

// JSON Schema validation with AJV
// based on http://json-schema.org/
const Ajv = require('ajv') // version >= 2.0.0
const localize = require('ajv-i18n')
// option `i18n` is required for this package to work
const ajv = Ajv({ allErrors: true })
// https://github.com/epoberezkin/ajv-i18n

// Node raw HTTP module
// const http = require('http')

function ajvErrorHandling (errors, respond, modName) {
  let moreInfo = '/' + modName + '/schema.json'
  let devMsg = 'Bad-formatted JSON body (POST) or URL query params (GET), details in user_message'
  let usrMsg = {
    'en_us': ajv.errorsText(errors, { separator: '\n' })
  }
  // translate
  localize['pt-BR'](errors)
  usrMsg.pt_br = ajv.errorsText(errors, { separator: '\n' })

  respond({}, null, 400, 'MOD901', devMsg, usrMsg, moreInfo)
}

function runModule (obj, respond, storeId, modName, validate) {
  // ajv
  let valid = validate(obj)
  if (!valid) {
    ajvErrorHandling(validate.errors, respond, modName)
  } else {
    // proceed to modules host
    respond(null, null, 204)
  }
}

function post ([ id, , body, respond, storeId ], modName, validate) {
  // run module with JSON body as object
  runModule(body, respond, storeId, modName, validate)
}

function get ([ id, meta, , respond, storeId ], modName, validate, schema) {
  if (id) {
    if (id === 'schema') {
      // return JSON Schema
      respond(schema)
    } else {
      let devMsg = 'Resource ID is acceptable only to JSON schema, at /' + modName + '/schema.json'
      respond({}, null, 406, 'MOD101', devMsg)
    }
  } else {
    // run module with query params as object
    runModule(meta.query, respond, storeId, modName, validate)
  }
}

module.exports = { 'get': get, 'post': post }
