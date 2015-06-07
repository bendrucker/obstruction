'use strict'

var isObject = require('is-object')
var partial = require('ap').partial
var mapObject = require('map-obj')
var isArray = require('isarray')
var dotProp = require('dot-prop')

exports = module.exports = obstruct

exports.array = function arraySchema (schema) {
  var parse = schema
  if (typeof parse !== 'function') {
    parse = obstruct(schema)
  }
  return function mapArray (array) {
    return array.map(parse)
  }
}

function obstruct (schema, object) {
  if (!isObject(schema)) {
    throw new Error('schema object is required')
  }
  if (arguments.length < 2) {
    return partial(obstruct, schema)
  }
  return mapObject(schema, createParser(object))
}

function createParser (object) {
  return function parser (key, value) {
    if (!value) {
      throw new Error('falsy values not allowed in schema (' + key + ')')
    }
    if (~key.indexOf('.')) {
      throw new Error('dots are not allowed in schema keys')
    }
    var srcKey, result
    if (isArray(value)) {
      // value is [key, value]
      // destructure, then process normally
      srcKey = value[0]
      value = value[1]
    } else {
      srcKey = key
    }
    if (value === true) {
      result = object[key]
    }
    if (typeof value === 'string') {
      result = dotProp.get(object, value)
    }
    if (typeof value === 'function') {
      result = value(dotProp.get(object, srcKey), object)
    }
    if (isObject(value)) {
      result = obstruct(value, dotProp.get(object, srcKey))
    }
    return [key, result]
  }
}
