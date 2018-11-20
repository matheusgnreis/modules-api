'use strict'

// log on files
// const logger = require('console-files')

// JSON Schema validation with AJV
// based on http://json-schema.org/
const Ajv = require('ajv')
const { validateOptions, errorHandling } = require('./../lib/Ajv.js')

const endpoint = '@checkout'
const schema = {
  '$schema': 'http://json-schema.org/draft-06/schema#',
  'title': 'Checkout input model',
  'description': 'Triggered to handle checkout with billing and shipping and create new order'
}

const GET = (id, meta, body, respond) => {
  if (id === 'schema') {
    // return JSON Schema
    respond(schema)
  } else {
    let devMsg = 'GET is acceptable only to JSON schema, at /' + endpoint + '/schema.json'
    respond({}, null, 406, 'CKT101', devMsg)
  }
}

const POST = (id, meta, body, respond, storeId) => {
}

module.exports = { GET, POST }
