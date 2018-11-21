'use strict'

exports.objectId = () => {
  // generate new random object ID
  return ('e' + Date.now()).padEnd(24, '1')
}
