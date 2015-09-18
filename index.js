'use strict'

var Obstruct = require('./obstruct')
var optional = require('./optional')
var array = require('./array')

Obstruct.optional = optional
Obstruct.array = array

module.exports = Obstruct
