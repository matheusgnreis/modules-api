'use strict'

// import common verbs (methods) functions
const httpVerbs = require('./#modules.js')
const modName = 'page_loaded'

const schema = {
  'description': 'Triggered after each storefront page load',
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

// validate module endpoints responses
const responseSchema = {
  'description': schema.description,
  'type': 'object',
  'additionalProperties': false,
  'properties': {
    'custom_data': {
      'type': 'object'
    }
  }
}

module.exports = httpVerbs(modName, schema, responseSchema)
