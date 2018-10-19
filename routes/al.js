'use strict'

// import common verbs (methods) functions
const httpVerbs = require('./#modules.js')
const modName = 'al'

const schema = {
  '$schema': 'http://json-schema.org/draft-06/schema#',
  'title': 'Module AL: Input model',
  'description': 'On all storefront page load',
  'type': 'object',
  'required': [ 'full_uri' ],
  'additionalProperties': false,
  'properties': {
    'full_uri': {
      'type': 'string',
      'maxLength': 255,
      'format': 'uri'
    }
  }
}

// validate module packages responses
const responseSchema = {
  '$schema': 'http://json-schema.org/draft-06/schema#',
  'title': 'Module AL: Package response model',
  'description': 'On all storefront page load',
  'type': 'object',
  'additionalProperties': false,
  'properties': {
    'custom_data': {
      'type': 'object'
    }
  }
}

module.exports = httpVerbs(modName, schema, responseSchema)
