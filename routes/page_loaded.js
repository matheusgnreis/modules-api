'use strict'

// import common verbs (methods) functions
const httpVerbs = require('./#applications.js')
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
    },
    'resource': {
      'type': 'string',
      'enum': [
        'products',
        'categories',
        'brands',
        'collections',
        'customers',
        'carts',
        'orders'
      ],
      'description': 'Store API resource related to visited page'
    },
    'resource_id': {
      'type': 'string',
      'pattern': '^[a-f0-9]{24}$',
      'description': 'Resource ID, if specified from page slug'
    },
    'utm': {
      'type': 'object',
      'additionalProperties': false,
      'properties': {
        'source': {
          'type': 'string',
          'maxLength': 100,
          'description': 'Parameter "utm_source", the referrer: (e.g. google, newsletter)'
        },
        'medium': {
          'type': 'string',
          'maxLength': 100,
          'description': 'Parameter "utm_medium", the marketing medium: (e.g. cpc, banner, email)'
        },
        'campaign': {
          'type': 'string',
          'maxLength': 200,
          'description': 'Parameter "utm_campaign", the product, promo code, or slogan (e.g. spring_sale)'
        },
        'term': {
          'type': 'string',
          'maxLength': 100,
          'description': 'Parameter "utm_term", identifies the paid keywords'
        },
        'content': {
          'type': 'string',
          'maxLength': 255,
          'description': 'Parameter "utm_content", used to differentiate ads'
        }
      },
      'description': 'UTM campaign HTTP parameters'
    },
    'affiliate_code': {
      'type': 'string',
      'maxLength': 200,
      'description': 'Code to identify the affiliate that referred the customer'
    },
    'channel_id': {
      'type': 'integer',
      'min': 10000,
      'max': 4294967295,
      'description': 'Channel unique identificator'
    },
    'channel_type': {
      'type': 'string',
      'maxLength': 20,
      'enum': [ 'ecommerce', 'mobile', 'pdv', 'button', 'facebook', 'chatbot' ],
      'default': 'ecommerce',
      'description': 'Channel type or source'
    },
    'domain': {
      'type': 'string',
      'minLength': 4,
      'maxLength': 100,
      'pattern': '^[0-9a-z-.]+$',
      'description': 'Store domain name (numbers and lowercase letters, eg.: www.myshop.sample)'
    },
    'lang': {
      'type': 'string',
      'pattern': '^[a-z]{2}(_[a-z]{2})?$',
      'description': 'Language two letters code, sometimes with region, eg.: pt_br, fr, en_us'
    },
    'customer': {
      'type': 'object',
      'additionalProperties': false,
      'required': [ 'main_email', 'name' ],
      'properties': {
        '_id': {
          'type': [ 'null', 'string' ],
          'pattern': '^[a-f0-9]{24}$',
          'description': 'Customer ID'
        },
        'display_name': {
          'type': 'string',
          'maxLength': 50,
          'description': 'The name of this Customer, suitable for display'
        }
      },
      'description': 'Customer object summary'
    }
  }
}

// validate module endpoints responses
const responseSchema = {
  'description': schema.description,
  'type': 'object',
  'additionalProperties': false,
  'properties': {
    'script_uri': {
      'type': 'string',
      'maxLength': 1000,
      'format': 'uri',
      'description': 'Script (JS) link'
    },
    'onload_expression': {
      'type': 'string',
      'maxLength': 3000,
      'description': 'JS expression to run (with `eval`) after script load'
    }
  }
}

module.exports = httpVerbs(modName, schema, responseSchema)
