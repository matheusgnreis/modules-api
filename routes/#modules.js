'use strict'

// log on files
const logger = require('./../lib/Logger.js')

// JSON Schema validation with AJV
// based on http://json-schema.org/
const Ajv = require('ajv') // version >= 2.0.0
const localize = require('ajv-i18n')
// option `i18n` is required for this package to work
const ajv = Ajv({ allErrors: true })
// https://github.com/epoberezkin/ajv-i18n
const validateOptions = {
  allErrors: true,
  removeAdditional: true,
  multipleOfPrecision: 5,
  useDefaults: true
}

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

function runModule (obj, respond, storeId, modName, validate, responseValidate) {
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

    let errorCallback = (err, statusCode, devMsg) => {
      // not successful API call
      // send error response
      if (err) {
        logger.error(err)
        respond({}, null, 500, 'MOD801')
      } else {
        if (typeof statusCode !== 'number') {
          statusCode = 400
        }
        respond({}, null, statusCode, 'MOD802', devMsg)
      }
    }

    let successCallback = (body) => {
      // https://ecomstore.docs.apiary.io/#reference/applications/all-applications/list-all-store-applications
      let list = body.result
      if (Array.isArray(list)) {
        let results = []
        let num = list.length
        if (num > 0) {
          // count packages done
          let done = 0
          // body to POST to package PHP file
          let reqBody = {
            'module': modName,
            'params': obj
          }

          for (var i = 0; i < num; i++) {
            // ok, proceed to modules
            let pkg = list[i]
            reqBody.application = pkg
            Modules(pkg.app_id, pkg.version, reqBody, storeId, (err, rawData, parsedData) => {
              let result = {
                'app_id': pkg.app_id,
                'response': {
                  'text': rawData,
                  'json': parsedData
                },
                'validated': false,
                'error': false,
                'error_message': null
              }
              if (err) {
                result.error = true
                if (err.message) {
                  result.error_message = err.message
                }
              } else if (typeof parsedData === 'object' && parsedData !== null) {
                // validate response object
                result.validated = responseValidate(parsedData)
              }
              results.push(result)

              done++
              if (done === num) {
                // all done
                // obj as response 'meta'
                respond(results, obj)
              }
            })
          }
        } else {
          // no packages
          respond(results, obj)
        }
      }
    }

    Api(endpoint, method, body, storeId, errorCallback, successCallback)
  }
}

function post ([ id, , body, respond, storeId ], modName, validate, responseValidate) {
  // run module with JSON body as object
  runModule(body, respond, storeId, modName, validate, responseValidate)
}

function get ([ id, meta, , respond, storeId ], modName, validate, schema, responseValidate, responseSchema) {
  if (id) {
    switch (id) {
      case 'schema':
        // return JSON Schema
        respond(schema)
        break

      case 'pkg_response_schema':
        // return module packages responses JSON Schema
        respond(responseSchema)
        break

      default:
        let devMsg = 'Resource ID is acceptable only to JSON schema, at /' + modName + '/schema.json'
        respond({}, null, 406, 'MOD101', devMsg)
    }
  } else {
    // run module with query params as object
    runModule(meta.query, respond, storeId, modName, validate, responseValidate)
  }
}

// setup all modules with same methods
module.exports = (modName, schema, responseSchema) => {
  // validate request body
  const validate = Ajv(validateOptions).compile(schema)
  // validate module response body
  const responseValidate = Ajv(validateOptions).compile(responseSchema)

  return {
    'GET': function () {
      get(arguments, modName, validate, schema, responseValidate, responseSchema)
    },
    'POST': function () {
      post(arguments, modName, validate, responseValidate)
    }
  }
}
