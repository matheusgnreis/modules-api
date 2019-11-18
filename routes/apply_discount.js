'use strict'

// import common verbs (methods) functions
const httpVerbs = require('./#applications.js')
const modName = 'apply_discount'

const schema = {
  'description': 'Triggered to validate and apply discount value, must return discount and conditions',
  'type': 'object',
  'additionalProperties': false,
  'properties': {
    'discount_coupon': {
      'type': 'string',
      'maxLength': 255,
      'description': 'Text of discount coupon applied by customer'
    },
    'items': {
      'type': 'array',
      'maxItems': 3000,
      'items': {
        'type': 'object',
        'additionalProperties': false,
        'required': [ 'product_id', 'quantity', 'price' ],
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
          'sku': {
            'type': 'string',
            'minLength': 2,
            'maxLength': 100,
            'pattern': '^[A-Za-z0-9-_.]+$',
            'description': 'Product or variation unique reference code'
          },
          'name': {
            'type': 'string',
            'maxLength': 255,
            'description': 'Product or variation full name, or other label for this cart item'
          },
          'quantity': {
            'type': 'number',
            // 'multipleOf': 0.0001,
            'minimum': 0,
            'maximum': 9999999,
            'description': 'Item quantity in cart'
          },
          'currency_id': {
            'type': 'string',
            'pattern': '^[A-Z]{3}$',
            'default': 'BRL',
            'description': 'Designator of currency according to ISO 4217 (3 uppercase letters)'
          },
          'currency_symbol': {
            'type': 'string',
            'maxLength': 20,
            'default': 'R$',
            'description': 'Graphic symbol used as a shorthand for currency\'s name'
          },
          'price': {
            'type': 'number',
            // 'multipleOf': 0.00001,
            'minimum': 0,
            'maximum': 999999999,
            'description': 'Product sale price specifically for this cart'
          },
          'final_price': {
            'type': 'number',
            // 'multipleOf': 0.00001,
            'minimum': 0,
            'maximum': 999999999,
            'description': 'Final item price including additions due to customizations and gift wrap'
          }
        },
        'description': 'One of the cart items'
      },
      'description': 'Products composing the cart'
    },
    'currency_id': {
      'type': 'string',
      'pattern': '^[A-Z]{3}$',
      'default': 'BRL',
      'description': 'Designator of currency according to ISO 4217 (3 uppercase letters)'
    },
    'currency_symbol': {
      'type': 'string',
      'maxLength': 20,
      'default': 'R$',
      'description': 'Graphic symbol used as a shorthand for currency\'s name'
    },
    'amount': {
      'type': 'object',
      'additionalProperties': false,
      'required': [ 'total' ],
      'properties': {
        'total': {
          'type': 'number',
          // 'multipleOf': 0.00001,
          'minimum': 0,
          'maximum': 9999999999,
          'description': 'Order total amount'
        },
        'subtotal': {
          'type': 'number',
          // 'multipleOf': 0.00001,
          'minimum': 0,
          'maximum': 9999999999,
          'description': 'The sum of all items prices'
        },
        'freight': {
          'type': 'number',
          // 'multipleOf': 0.00001,
          'minimum': 0,
          'maximum': 9999999999,
          'description': 'Order freight cost'
        },
        'discount': {
          'type': 'number',
          // 'multipleOf': 0.00001,
          'minimum': 0,
          'maximum': 9999999999,
          'description': 'Applied discount value'
        },
        'tax': {
          'type': 'number',
          // 'multipleOf': 0.00001,
          'minimum': 0,
          'maximum': 9999999999,
          'description': 'The sum of all the taxes applied to the order'
        },
        'extra': {
          'type': 'number',
          // 'multipleOf': 0.00001,
          'minimum': 0,
          'maximum': 9999999999,
          'description': 'Sum of optional extra costs applied'
        }
      },
      'description': 'Object with sums of values'
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
    'extra_discount': {
      'type': 'object',
      'required': [ 'value' ],
      'additionalProperties': false,
      'properties': {
        'title': {
          'type': 'string',
          'maxLength': 100,
          'description': 'Title for the discount rule, can be the coupon or campaign name'
        },
        'description': {
          'type': 'string',
          'maxLength': 255,
          'description': 'Short text description for the discount rule'
        },
        'apply_at': {
          'type': 'string',
          'enum': [ 'total', 'subtotal', 'freight' ],
          'default': 'subtotal',
          'description': 'In which value the discount will be applied at checkout'
        },
        'type': {
          'type': 'string',
          'enum': [ 'percentage', 'fixed' ],
          'default': 'percentage',
          'description': 'Discount type'
        },
        'value': {
          'type': 'number',
          // 'multipleOf': 0.0001,
          'minimum': -99999999,
          'maximum': 99999999,
          'description': 'Discount value, percentage or fixed'
        }
      },
      'description': 'Discount available for current shopping cart or coupon'
    },
    'invalid_coupon_message': {
      'type': 'string',
      'maxLength': 255,
      'description': 'Short message for curtomer if coupon/campaign tried is invalid'
    }
  }
}

module.exports = httpVerbs(modName, schema, responseSchema)
