'use strict'

var isObject = require('is-object')
var dotProp = require('dot-prop')
var isArray = require('isarray')
var mapObject = require('map-obj')
var partial = require('ap').partial

module.exports = Obstruct

function Obstruct (schema, object) {
  if (!isObject(schema)) {
    throw new Error('schema object is required')
  }

  if (arguments.length < 2) {
    return partial(Obstruct, schema)
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
      result = value(dotProp.get(object, srcKey), object, srcKey)
    }

    if (isObject(value)) {
      result = Obstruct(value, dotProp.get(object, srcKey))
    }

    return [key, result]
  }
}
