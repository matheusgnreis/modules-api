'use strict'

// log on files
const logger = require('console-files')

// JSON Schema validation with AJV
// based on http://json-schema.org/
const Ajv = require('ajv')
const { validateOptions, errorHandling } = require('./../lib/Ajv.js')

const GET = (id, meta, body, respond, storeId) => {
}

const POST = (id, meta, body, respond, storeId) => {
}

module.exports = {
  GET,
  POST
}
