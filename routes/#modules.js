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

// REST clients
const Api = require('./../lib/Api.js')
const Modules = require('./../lib/Modules.js')

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
    // list module packages
    let endpoint = 'applications.json' +
      '?status=active' +
      '&type=module_package' +
      '&module=' + modName +
      '&fields=app_id,version,hidden_data'
    let method = 'GET'
    let body = null

    let errorCallback = (err, statusCode, devMsg, usrMsg) => {
      // not successful API call
      // send error response
      if (err) {
        respond({}, null, 500, 'MOD801')
      } else {
        if (typeof statusCode !== 'number') {
          statusCode = 400
        }
        respond({}, null, statusCode, 'MOD802', devMsg, usrMsg)
      }
    }

    let successCallback = (body) => {
      // https://ecomstore.docs.apiary.io/#reference/applications/all-applications/list-all-store-applications
      let list = body.result
      if (Array.isArray(list)) {
        // count packages done
        let done = 0
        let results = []
        let num = list.length
        // body to POST to package PHP file
        let reqBody = {
          'module': modName,
          'params': obj
        }

        for (var i = 0; i < num; i++) {
          // ok, proceed to modules
          let pkg = list[i]
          reqBody.application = pkg
          Modules(pkg.app_id, pkg.version, reqBody, storeId, (err, body) => {
            if (!err) {
              results.push({
                'app_id': pkg.app_id,
                'result': body
              })
            }
            done++
            if (done === num) {
              // all done
              // obj as response 'meta'
              respond(results, obj)
            }
          })
        }
      }
    }

    Api(endpoint, method, body, storeId, errorCallback, successCallback)
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
