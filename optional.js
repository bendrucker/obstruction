'use struct'

var Obstruct = require('./obstruct')

module.exports = function optional (schema) {
  var parse = schema
  if (typeof parse !== 'function') {
    parse = Obstruct(schema)
  }

  return function optionalValue (value) {
    if (value != null) return parse(value)
  }
}
