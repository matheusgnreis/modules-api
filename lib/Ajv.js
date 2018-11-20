'use strict'

// JSON Schema validation with AJV
// based on http://json-schema.org/
const Ajv = require('ajv')
const localize = require('ajv-i18n')
// option `i18n` is required for this package to work
const ajv = Ajv({ allErrors: true })

exports.validateOptions = {
  allErrors: false,
  removeAdditional: true,
  multipleOfPrecision: 5,
  useDefaults: true
}

exports.errorHandling = (errors, respond, endpoint) => {
  let moreInfo = '/' + endpoint + '/schema.json'
  let devMsg = 'Bad-formatted JSON body (POST) or URL query params (GET), details in user_message'
  let usrMsg = {
    'en_us': ajv.errorsText(errors, { separator: '\n' })
  }
  // translate
  localize['pt-BR'](errors)
  usrMsg.pt_br = ajv.errorsText(errors, { separator: '\n' })

  respond({}, null, 400, 'MOD901', devMsg, usrMsg, moreInfo)
}
