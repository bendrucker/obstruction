'use strict'

var Obstruct = require('./obstruct')
var optional = require('./optional')
var array = require('./array')
var parent = require('./parent')

Obstruct.optional = optional
Obstruct.array = array
Obstruct.parent = parent

module.exports = Obstruct
