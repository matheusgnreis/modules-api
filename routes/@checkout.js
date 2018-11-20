'use strict'

// log on files
// const logger = require('console-files')

// JSON Schema validation with AJV
// based on http://json-schema.org/
// const Ajv = require('ajv')
// const { validateOptions, errorHandling } = require('./../lib/Ajv.js')

const endpoint = '@checkout'
const schema = {
  '$schema': 'http://json-schema.org/draft-06/schema#',
  'title': 'Checkout input model',
  'description': 'Triggered to handle checkout with billing and shipping and create new order',
  'type': 'object',
  'required': [ 'items', 'shipping', 'transaction' ],
  'additionalProperties': false,
  'definitions': {
    'address': {
      'type': 'object',
      'additionalProperties': false,
      'required': [ 'zip' ],
      'properties': {
        'zip': {
          'type': 'string',
          'maxLength': 30,
          'description': 'ZIP (CEP, postal...) code'
        },
        'street': {
          'type': 'string',
          'maxLength': 200,
          'description': 'Street or public place name'
        },
        'number': {
          'type': 'integer',
          'min': 1,
          'max': 9999999,
          'description': 'House or building street number'
        },
        'complement': {
          'type': 'string',
          'maxLength': 100,
          'description': 'Address complement or second line, such as apartment number'
        },
        'borough': {
          'type': 'string',
          'maxLength': 100,
          'description': 'Borough name'
        },
        'near_to': {
          'type': 'string',
          'maxLength': 100,
          'description': 'Some optional other reference for this address'
        },
        'line_address': {
          'type': 'string',
          'maxLength': 255,
          'description': 'Full in line mailing address, should include street, number and borough'
        },
        'city': {
          'type': 'string',
          'maxLength': 100,
          'description': 'City name'
        },
        'country': {
          'type': 'string',
          'maxLength': 50,
          'description': 'Country name'
        },
        'country_code': {
          'type': 'string',
          'minLength': 2,
          'maxLength': 2,
          'pattern': '^[A-Z]+$',
          'description': 'An ISO 3166-2 country code'
        },
        'province': {
          'type': 'string',
          'maxLength': 100,
          'description': 'Province or state name'
        },
        'province_code': {
          'type': 'string',
          'minLength': 2,
          'maxLength': 2,
          'pattern': '^[A-Z]+$',
          'description': 'The two-letter code for the province or state'
        },
        'name': {
          'type': 'string',
          'maxLength': 70,
          'description': 'The name of recipient, generally is the customer\'s name'
        },
        'last_name': {
          'type': 'string',
          'maxLength': 70,
          'description': 'The recipient\'s last name'
        },
        'phone': {
          'type': 'object',
          'additionalProperties': false,
          'required': [ 'number' ],
          'properties': {
            'country_code': {
              'type': 'integer',
              'min': 1,
              'max': 999,
              'description': 'Country calling code (without +), defined by standards E.123 and E.164'
            },
            'number': {
              'type': 'string',
              'maxLength': 19,
              'pattern': '^[0-9]+$',
              'description': 'The actual phone number, digits only'
            }
          },
          'description': 'Customer phone number for this mailing address'
        }
      },
      'description': 'Address object'
    }
  },
  'properties': {
    'items': {
      'type': 'array',
      'maxItems': 3000,
      'items': {
        'type': 'object',
        'additionalProperties': false,
        'required': [ 'product_id', 'quantity' ],
        'properties': {
          'product_id': {
            'type': 'string',
            'pattern': '^[a-f0-9]{24}$',
            'description': 'Product ID'
          },
          'variation_id': {
            'type': 'string',
            'pattern': '^[a-f0-9]{24}$',
            'description': 'ID to specify the variation added to cart, if product has variations'
          },
          'quantity': {
            'type': 'number',
            'multipleOf': 0.0001,
            'minimum': 0,
            'maximum': 9999999,
            'description': 'Item quantity in cart'
          }
        }
      }
    },
    'shipping': {
      'type': 'object',
      'additionalProperties': false,
      'required': [ 'to' ],
      'properties': {
        'from': {
          '$ref': '#/definitions/address',
          'description': 'Sender\'s address'
        },
        'to': {
          '$ref': '#/definitions/address',
          'description': 'Shipping address (recipient)'
        },
        'own_hand': {
          'type': 'boolean',
          'default': false,
          'description': 'Whether the package must be delivered with additional service "own hand"'
        },
        'receipt': {
          'type': 'boolean',
          'default': false,
          'description': 'If the package will be delivered with acknowledgment of receipt'
        },
        'service_code': {
          'type': 'string',
          'maxLength': 70,
          'description': 'Code of service defined by carrier, if shipping method is already defined'
        }
      },
      'description': 'Shipping options to calculate freight and deadline'
    },
    'transaction': {
      'type': 'object',
      'additionalProperties': false,
      'required': [ 'to' ],
      'properties': {
      },
      'description': 'Payment options to create transaction'
    },
    'lang': {
      'type': 'string',
      'pattern': '^[a-z]{2}(_[a-z]{2})?$',
      'description': 'Language two letters code, sometimes with region, eg.: pt_br, fr, en_us'
    }
  }
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
