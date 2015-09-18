'use strict'

var Obstruct = require('./obstruct')

module.exports = function parent (schema) {
  var parse = schema
  if (typeof parse !== 'function') {
    parse = Obstruct(schema)
  }

  return function parseParent (value, parent) {
    return parse(parent)
  }
}
