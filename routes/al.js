'use strict'

// JSON Schema validation with AJV
// based on http://json-schema.org/
const Ajv = require('ajv') // version >= 2.0.0

// import common verbs (methods) functions
const httpVerbs = require('./#modules.js')
const modName = 'al'

const schema = {
  '$schema': 'http://json-schema.org/draft-06/schema#',
  'title': 'Module AL',
  'description': 'On all storefront page load',
  'type': 'object',
  'required': [ 'domain', 'uri' ],
  'additionalProperties': false,
  'properties': {
    'domain': {
      'type': 'string',
      'maxLength': 80,
      'format': 'hostname'
    },
    'uri': {
      'type': 'string',
      'maxLength': 255,
      'format': 'uri'
    }
  }
}
const validate = Ajv({ allErrors: true, removeAdditional: true }).compile(schema)

// validate module packages responses
const responseSchema = {
  '$schema': 'http://json-schema.org/draft-06/schema#',
  'type': 'object',
  'additionalProperties': false,
  'properties': {
    'custom_data': {
      'type': 'object'
    }
  }
}
const responseValidate = Ajv({ allErrors: false }).compile(responseSchema)

module.exports = {
  'GET': function () {
    httpVerbs.get(arguments, modName, validate, schema, responseValidate, responseSchema)
  },
  'POST': function () {
    httpVerbs.post(arguments, modName, validate, responseValidate)
  }
}
