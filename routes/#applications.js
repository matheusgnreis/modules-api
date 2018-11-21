'use strict'

// log on files
const logger = require('console-files')

// JSON Schema validation with AJV
// based on http://json-schema.org/
const Ajv = require('ajv')
const { validateOptions, errorHandling } = require('./../lib/Ajv.js')
const ajv = Ajv({ allErrors: true })

// REST clients
const Api = require('./../lib/Api.js')
const Modules = require('./../lib/Modules.js')

function runModule (obj, respond, storeId, modName, validate, responseValidate, appId) {
  // ajv
  let valid = validate(obj)
  if (!valid) {
    errorHandling(validate.errors, respond, modName)
  } else {
    // list module packages
    let endpoint = 'applications.json' +
      '?status=active' +
      '&type=external' +
      '&modules.' + modName + '.enabled=true' +
      '&fields=_id,app_id,version,data,hidden_data,modules.' + modName
    if (appId) {
      endpoint += '&app_id=' + appId
    }
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
            module: modName,
            params: obj
          }

          for (var i = 0; i < num; i++) {
            // ok, proceed to modules
            let pkg = list[i]
            // declare data objects to prevent applications fatal errors
            if (!pkg.hasOwnProperty('hidden_data')) {
              pkg.hidden_data = {}
            }
            if (!pkg.hasOwnProperty('data')) {
              pkg.data = {}
            }
            reqBody.application = pkg
            let url = pkg.modules[modName].endpoint
            // handle request with big timeout if app ID was specified
            let bigTimeout = !!(appId)

            // send POST request
            Modules(url, reqBody, storeId, bigTimeout, (err, response) => {
              // mount result object
              let result = {
                _id: pkg._id,
                app_id: pkg.app_id,
                version: pkg.version,
                validated: false,
                error: false,
                error_message: null,
                response
              }

              if (err) {
                result.error = true
                if (err.message) {
                  result.error_message = err.message
                }
              } else if (typeof response === 'object' && response !== null) {
                // validate response object
                result.validated = responseValidate(response)
                if (!result.validated) {
                  result.response_errors = ajv.errorsText(responseValidate.errors, {
                    separator: '\n'
                  })
                } else {
                  result.response_errors = null
                }
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

function post ([ id, meta, body, respond, storeId ], modName, validate, responseValidate) {
  // run module with JSON body as object
  runModule(body, respond, storeId, modName, validate, responseValidate, meta.query.app_id)
}

function get ([ id, meta, , respond, storeId ], modName, validate, schema, responseValidate, responseSchema) {
  if (id) {
    switch (id) {
      case 'schema':
        // return JSON Schema
        respond(Object.assign({
          $schema: 'http://json-schema.org/draft-06/schema#',
          title: 'Module `' + modName + '`: Input model'
        }, schema))
        break

      case 'response_schema':
        // return module packages responses JSON Schema
        respond(Object.assign({
          $schema: 'http://json-schema.org/draft-06/schema#',
          title: 'Module `' + modName + '`: Response model'
        }, responseSchema))
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
  // validate package response body
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
