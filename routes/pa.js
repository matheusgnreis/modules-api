'use strict'

// import common verbs (methods) functions
const httpVerbs = require('./#modules.js')
const modName = 'pa'

const schema = {
  '$schema': 'http://json-schema.org/draft-06/schema#',
  'title': 'Module PA: Input model',
  'description': 'On payment methods listing or creating transactions',
  'type': 'object',
  'required': [ 'items', 'amount' ],
  'additionalProperties': false,
  'properties': {
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
            'multipleOf': 0.0001,
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
            'multipleOf': 0.00001,
            'minimum': 0,
            'maximum': 999999999,
            'description': 'Product sale price specifically for this cart'
          },
          'final_price': {
            'type': 'number',
            'multipleOf': 0.00001,
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
          'multipleOf': 0.00001,
          'minimum': 0,
          'maximum': 9999999999,
          'description': 'Order total amount'
        },
        'subtotal': {
          'type': 'number',
          'multipleOf': 0.00001,
          'minimum': 0,
          'maximum': 9999999999,
          'description': 'The sum of all items prices'
        },
        'freight': {
          'type': 'number',
          'multipleOf': 0.00001,
          'minimum': 0,
          'maximum': 9999999999,
          'description': 'Order freight cost'
        },
        'discount': {
          'type': 'number',
          'multipleOf': 0.00001,
          'minimum': 0,
          'maximum': 9999999999,
          'description': 'Applied discount value'
        },
        'tax': {
          'type': 'number',
          'multipleOf': 0.00001,
          'minimum': 0,
          'maximum': 9999999999,
          'description': 'The sum of all the taxes applied to the order'
        },
        'extra': {
          'type': 'number',
          'multipleOf': 0.00001,
          'minimum': 0,
          'maximum': 9999999999,
          'description': 'Sum of optional extra costs applied'
        }
      },
      'description': 'Object with sums of values'
    },
    'checkout': {
      'type': 'object',
      'required': [ 'payment_method' ],
      'additionalProperties': false,
      'properties': {
        'payment_method': {
          'type': 'object',
          'required': [ 'code' ],
          'additionalProperties': false,
          'properties': {
            'code': {
              'type': 'string',
              'enum': [
                'credit_card',
                'banking_billet',
                'online_debit',
                'account_deposit',
                'debit_card',
                'balance_on_intermediary',
                'loyalty_points',
                'other'
              ],
              'description': 'Standardized payment method code'
            },
            'name': {
              'type': 'string',
              'maxLength': 200,
              'description': 'Short description for payment method'
            }
          },
          'description': 'Payment method object'
        },
        'payer': {
          'type': 'object',
          'additionalProperties': false,
          'properties': {
            'fullname': {
              'type': 'string',
              'maxLength': 255,
              'description': 'Payer full name or company corporate name'
            },
            'birth_date': {
              'type': 'object',
              'additionalProperties': false,
              'properties': {
                'day': {
                  'type': 'integer',
                  'min': 1,
                  'max': 31,
                  'description': 'Day of birth'
                },
                'month': {
                  'type': 'integer',
                  'min': 1,
                  'max': 12,
                  'description': 'Number of month of birth'
                },
                'year': {
                  'type': 'integer',
                  'min': 1800,
                  'max': 2200,
                  'description': 'Year of birth'
                }
              },
              'description': 'Date of payer birth'
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
                },
                'type': {
                  'type': 'string',
                  'enum': [ 'home', 'personal', 'work', 'other' ],
                  'description': 'The type of phone'
                }
              },
              'description': 'Payer contact phone'
            },
            'registry_type': {
              'type': 'string',
              'enum': [ 'p', 'j' ],
              'description': 'Physical or juridical (company) person'
            },
            'doc_country': {
              'type': 'string',
              'minLength': 2,
              'maxLength': 2,
              'pattern': '^[A-Z]+$',
              'description': 'Country of document origin, an ISO 3166-2 code'
            },
            'doc_number': {
              'type': 'string',
              'maxLength': 19,
              'pattern': '^[0-9]+$',
              'description': 'Responsible person or organization document number (only numbers)'
            }
          },
          'description': 'Transation payer info'
        },
        'intermediator_buyer_id': {
          'type': 'string',
          'maxLength': 255,
          'description': 'ID of customer account in the intermediator'
        },
        'billing_address': {
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
            }
          },
          'description': 'The mailing address associated with the payment method'
        },
        'credit_card': {
          'type': 'object',
          'additionalProperties': false,
          'properties': {
            'holder_name': {
              'type': 'string',
              'maxLength': 100,
              'description': 'Full name of the holder, as it is on the credit card'
            },
            'bin': {
              'type': 'integer',
              'min': 1,
              'max': 9999999,
              'description': 'Issuer identification number (IIN), known as bank identification number (BIN)'
            },
            'company': {
              'type': 'string',
              'maxLength': 100,
              'description': 'Credit card issuer name, eg.: Visa, American Express, MasterCard'
            },
            'last_digits': {
              'type': 'string',
              'maxLength': 4,
              'pattern': '^[0-9]+$',
              'description': 'Last digits (up to 4) of credit card number'
            },
            'token': {
              'type': 'string',
              'maxLength': 255,
              'description': 'Unique credit card token'
            },
            'cvv': {
              'type': 'integer',
              'min': 99,
              'max': 99999,
              'description': 'Credit card CVV number (Card Verification Value)'
            },
            'hash': {
              'type': 'string',
              'maxLength': 2000,
              'description': 'Credit card encrypted hash'
            }
          },
          'description': 'Credit card data, if payment will be done with credit card'
        },
        'installments_number': {
          'type': 'integer',
          'minimum': 1,
          'maximum': 199,
          'description': 'Number of installments chosen'
        }
      },
      'description': 'Checkout payment options, sent if it was already chosen by customer'
    }
  }
}

// validate module packages responses
const responseSchema = {
  '$schema': 'http://json-schema.org/draft-06/schema#',
  'title': 'Module PA: Package response model',
  'description': schema.description,
  'type': 'object',
  'required': [ 'payment_gateways' ],
  'additionalProperties': false,
  'properties': {
    'payment_gateways': {
      'type': 'array',
      'minItems': 1,
      'maxItems': 30,
      'items': {
        'type': 'object',
        'additionalProperties': false,
        'required': [ 'label', 'transaction' ],
        'properties': {
          'label': {
            'type': 'string',
            'maxLength': 50,
            'description': 'Name of payment method shown to customers'
          },
          'icon': {
            'type': 'string',
            'maxLength': 255,
            'format': 'uri',
            'description': 'Payment icon image URI'
          },
          'intermediator': {
            'type': 'object',
            'additionalProperties': false,
            'required': [ 'code' ],
            'properties': {
              'name': {
                'type': 'string',
                'maxLength': 255,
                'description': 'Name of payment intermediator'
              },
              'link': {
                'type': 'string',
                'maxLength': 255,
                'format': 'uri',
                'description': 'URI to intermediator website'
              },
              'code': {
                'type': 'string',
                'minLength': 6,
                'maxLength': 70,
                'pattern': '^[a-z0-9_]+$',
                'description': 'Gateway name standardized as identification code'
              }
            },
            'description': 'Payment intermediator'
          },
          'payment_url': {
            'type': 'string',
            'maxLength': 255,
            'format': 'uri',
            'description': 'Base URI to payments'
          },
          'transaction': {
            'type': 'object',
            'additionalProperties': false,
            'required': [ 'payment_method', 'amount' ],
            'properties': {
              'type': {
                'type': 'string',
                'enum': [ 'payment', 'recurrence' ],
                'default': 'payment',
                'description': 'Transaction type'
              },
              'payment_method': {
                'type': 'object',
                'required': [ 'code' ],
                'additionalProperties': false,
                'properties': {
                  'code': {
                    'type': 'string',
                    'enum': [
                      'credit_card',
                      'banking_billet',
                      'online_debit',
                      'account_deposit',
                      'debit_card',
                      'balance_on_intermediary',
                      'loyalty_points',
                      'other'
                    ],
                    'description': 'Standardized payment method code'
                  },
                  'name': {
                    'type': 'string',
                    'maxLength': 200,
                    'description': 'Short description for payment method'
                  }
                },
                'description': 'Payment method object'
              },
              'intermediator': {
                'type': 'object',
                'additionalProperties': false,
                'properties': {
                  'transaction_id': {
                    'type': 'string',
                    'maxLength': 255,
                    'description': 'Transaction ID in the intermediator'
                  },
                  'transaction_code': {
                    'type': 'string',
                    'maxLength': 255,
                    'description': 'Transaction code in the intermediator'
                  },
                  'transaction_reference': {
                    'type': 'string',
                    'maxLength': 255,
                    'description': 'Transaction reference code'
                  },
                  'payment_method': {
                    'type': 'object',
                    'required': [ 'code' ],
                    'additionalProperties': false,
                    'properties': {
                      'code': {
                        'type': 'string',
                        'maxLength': 100,
                        'description': 'Payment method code'
                      },
                      'name': {
                        'type': 'string',
                        'maxLength': 200,
                        'description': 'Short description for payment method'
                      }
                    },
                    'description': 'Payment method as defined by intermediator'
                  },
                  'buyer_id': {
                    'type': 'string',
                    'maxLength': 255,
                    'description': 'ID of customer account in the intermediator'
                  }
                },
                'description': 'Transaction properties in the intermediator'
              },
              'credit_card': {
                'type': 'object',
                'additionalProperties': false,
                'properties': {
                  'holder_name': {
                    'type': 'string',
                    'maxLength': 100,
                    'description': 'Full name of the holder, as it is on the credit card'
                  },
                  'avs_result_code': {
                    'type': [ 'string', 'null' ],
                    'maxLength': 1,
                    'pattern': '^[A-Z]$',
                    'description': 'Response code from AVS: http://www.emsecommerce.net/avs_cvv2_response_codes.htm'
                  },
                  'cvv_result_code': {
                    'type': [ 'string', 'null' ],
                    'maxLength': 1,
                    'pattern': '^[A-Z]$',
                    'description': 'Response code from credit card company, such as AVS result code'
                  },
                  'bin': {
                    'type': 'integer',
                    'min': 1,
                    'max': 9999999,
                    'description': 'Issuer identification number (IIN), known as bank identification number (BIN)'
                  },
                  'company': {
                    'type': 'string',
                    'maxLength': 100,
                    'description': 'Credit card issuer name, eg.: Visa, American Express, MasterCard'
                  },
                  'last_digits': {
                    'type': 'string',
                    'maxLength': 4,
                    'pattern': '^[0-9]+$',
                    'description': 'Last digits (up to 4) of credit card number'
                  },
                  'token': {
                    'type': 'string',
                    'maxLength': 255,
                    'description': 'Unique credit card token'
                  },
                  'error_code': {
                    'type': 'string',
                    'enum': [
                      'incorrect_number',
                      'invalid_number',
                      'invalid_expiry_date',
                      'invalid_cvc',
                      'expired_card',
                      'incorrect_cvc',
                      'incorrect_zip',
                      'incorrect_address',
                      'card_declined',
                      'processing_error',
                      'call_issuer',
                      'pick_up_card'
                    ],
                    'description': 'Credit card processing standardized error code'
                  }
                },
                'description': 'Credit card data, if payment was done with credit card'
              },
              'banking_billet': {
                'type': 'object',
                'additionalProperties': false,
                'properties': {
                  'code': {
                    'type': 'string',
                    'maxLength': 200,
                    'description': 'Ticket code, generally a barcode number'
                  },
                  'valid_thru': {
                    'type': 'string',
                    'format': 'date-time',
                    'description': 'Date and time of expiration, in ISO 8601 standard representation'
                  },
                  'text_lines': {
                    'type': 'array',
                    'maxItems': 5,
                    'items': {
                      'type': 'string',
                      'maxLength': 255,
                      'description': 'Phrase or paragraph'
                    },
                    'description': 'Text lines on ticket'
                  },
                  'link': {
                    'type': 'string',
                    'maxLength': 255,
                    'format': 'uri',
                    'description': 'Direct link (URI) to banking billet'
                  }
                },
                'description': 'Banking billet data, if payment was done with banking billet'
              },
              'currency_id': {
                'type': 'string',
                'pattern': '^[A-Z]{3}$',
                'description': 'Currency ID specific for this transaction, if different of order currency ID'
              },
              'currency_symbol': {
                'type': 'string',
                'maxLength': 20,
                'description': 'Currency symbol specific for this transaction'
              },
              'discount': {
                'type': 'number',
                'multipleOf': 0.0001,
                'minimum': -999999999,
                'maximum': 999999999,
                'description': 'Discount by payment method, negative if value was additionated (not discounted)'
              },
              'amount': {
                'type': 'number',
                'multipleOf': 0.00001,
                'minimum': 0,
                'maximum': 9999999999,
                'description': 'Transaction amount, disregarding installment rates'
              },
              'flags': {
                'type': 'array',
                'uniqueItems': true,
                'maxItems': 10,
                'items': {
                  'type': 'string',
                  'maxLength': 20,
                  'description': 'Flag title'
                },
                'description': 'Flags to associate additional info'
              },
              'custom_fields': {
                'type': 'array',
                'maxItems': 10,
                'items': {
                  'type': 'object',
                  'additionalProperties': false,
                  'required': [ 'field', 'value' ],
                  'properties': {
                    'field': {
                      'type': 'string',
                      'maxLength': 50,
                      'description': 'Field name'
                    },
                    'value': {
                      'type': 'string',
                      'maxLength': 255,
                      'description': 'Field value'
                    }
                  },
                  'description': 'Custom field object'
                },
                'description': 'List of custom fields'
              },
              'notes': {
                'type': 'string',
                'maxLength': 255,
                'description': 'Optional notes with additional info about this transaction'
              }
            },
            'description': 'Order payment transaction object'
          },
          'installment_options': {
            'type': 'array',
            'maxItems': 30,
            'items': {
              'type': 'object',
              'required': [ 'number', 'value' ],
              'additionalProperties': false,
              'properties': {
                'number': {
                  'type': 'integer',
                  'minimum': 2,
                  'maximum': 999,
                  'description': 'Number of installments'
                },
                'value': {
                  'type': 'number',
                  'multipleOf': 0.00001,
                  'minimum': 0,
                  'maximum': 999999999,
                  'description': 'Installment value'
                },
                'tax': {
                  'type': 'boolean',
                  'default': false,
                  'description': 'Tax applied'
                }
              },
              'description': 'Installment option'
            },
            'description': 'List of options for installment'
          },
          'js_client': {
            'type': 'object',
            'required': [ 'script_uri' ],
            'additionalProperties': false,
            'properties': {
              'script_uri': {
                'type': 'string',
                'maxLength': 1000,
                'format': 'uri',
                'description': 'Script (JS) link'
              },
              'fallback_script_uri': {
                'type': 'string',
                'maxLength': 1000,
                'format': 'uri',
                'description': 'Optional script link to try if the first URI goes offline'
              },
              'onload_expression': {
                'type': 'string',
                'maxLength': 2000,
                'description': 'JS expression to run (with `eval`) after script load'
              },
              'cc_hash': {
                'type': 'object',
                'required': [ 'function' ],
                'additionalProperties': false,
                'properties': {
                  'function': {
                    'type': 'string',
                    'maxLength': 50,
                    'description': 'Func name, receives obj with `name`, `doc`, `number`, `cvc`, `month`, `year`'
                  },
                  'is_promise': {
                    'type': 'boolean',
                    'default': false,
                    'description': 'If it is a Promise, use for async process'
                  }
                },
                'description': 'Function to call for credit card hash generation, must return hash string'
              },
              'cc_brand': {
                'type': 'object',
                'required': [ 'function' ],
                'additionalProperties': false,
                'properties': {
                  'function': {
                    'type': 'string',
                    'maxLength': 50,
                    'description': 'Func name, receives obj with `number`'
                  },
                  'is_promise': {
                    'type': 'boolean',
                    'default': false,
                    'description': 'If it is a Promise, use for async process'
                  }
                },
                'description': 'Function to call for card validation, must return brand string or false'
              }
            },
            'description': 'Gateway web JS SDK, usually to handle credit cards with encryption'
          }
        },
        'description': 'Payment option (gateway)'
      },
      'description': 'Payment gateway options list'
    }
  }
}

module.exports = httpVerbs(modName, schema, responseSchema)
