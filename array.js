'use strict'

var Obstruct = require('./obstruct')

module.exports = function arraySchema (schema) {
  var parse = schema
  if (typeof parse !== 'function') {
    parse = Obstruct(schema)
  }

  return function mapArray (array) {
    return array.map(parse)
  }
}
