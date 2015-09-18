'use strict'

var test = require('tape')
var Obstruct = require('./')

test('obstruction', function (t) {
  t.deepEqual(Obstruct({foo: true})({foo: 'bar'}), {
    foo: 'bar'
  }, 'passthrough')

  t.deepEqual(Obstruct({foo: 'bar'})({foo: 'bar', bar: 'baz'}), {
    foo: 'baz'
  }, 'source key')

  t.deepEqual(Obstruct({foo: 'a.bar'})({a: {bar: 'baz'}}), {
    foo: 'baz'
  }, 'dot props')

  function uppercase (string) {
    return string.toUpperCase()
  }
  t.deepEqual(Obstruct({foo: uppercase})({foo: 'bar'}), {
    foo: 'BAR'
  }, 'fn transform')

  t.deepEqual(Obstruct({foo: {bar: uppercase}})({foo: {bar: 'baz'}}), {
    foo: {bar: 'BAZ'}
  }, 'nested schemas')

  t.deepEqual(Obstruct({a: ['foo', uppercase]})({foo: 'bar'}), {
    a: 'BAR'
  }, 'key change w/ fn transform')

  t.deepEqual(Obstruct({b: ['foo.bar', uppercase]})({foo: {bar: 'baz'}}), {
    b: 'BAZ'
  }, 'dot key change w/ fn transform')

  t.deepEqual(Obstruct({c: ['foo', {bar: uppercase}]})({foo: {bar: 'baz'}}), {
    c: {bar: 'BAZ'}
  }, 'key change w/ nested schema')

  t.deepEqual(Obstruct({children: Obstruct.array({name: uppercase})})({
    children: [{name: 'ben'}, {name: 'rachel'}]
  }), {
    children: [{name: 'BEN'}, {name: 'RACHEL'}]
  }, 'nested array')

  t.deepEqual(Obstruct.array(uppercase)(['Yankees', 'Giants']), [
    'YANKEES',
    'GIANTS'
  ], 'mapping fn')

  var uppercaseItems = Obstruct.array(uppercase)
  var required = Obstruct({foo: uppercaseItems})
  var optional = Obstruct({foo: Obstruct.optional(uppercaseItems)})
  t.deepEqual(optional({foo: ['bar']}), {
    foo: ['BAR']
  })
  t.throws(required.bind(null, {}), 'normally throws')
  t.deepEqual(optional({}), {foo: undefined}, 'optional handles undefined value')

  t.deepEqual(Obstruct({foo: true}, {foo: 'bar'}), {foo: 'bar'}, 'single call')

  var parse = Obstruct({
    title: 'name',
    description: true,
    active: ['status', function (status) {
      return status === 'active'
    }],
    author: {
      name: true,
      username: 'login'
    },
    stars: function (stars) {
      return stars.map(function (star) {
        return star.login
      })
    },
    writable: 'permissions.push',
    mine: ['author.login', function (login) {
      return login === 'bendrucker'
    }]
  })
  t.deepEqual(parse({
    name: 'obstruction',
    description: 'Object restructuring and parsing',
    status: 'active',
    author: {
      name: 'Ben Drucker',
      login: 'bendrucker'
    },
    stars: [{
      login: 'BrendanEich'
    }],
    permissions: {
      read: true,
      push: true
    }
  }),
  {
    title: 'obstruction',
    description: 'Object restructuring and parsing',
    active: true,
    author: {
      name: 'Ben Drucker',
      username: 'bendrucker'
    },
    stars: ['BrendanEich'],
    writable: true,
    mine: true
  }, 'all together now')

  t.throws(Obstruct, 'schema object is required')
  t.throws(Obstruct({foo: ''}).bind(null, {}), /falsy values/)
  t.throws(Obstruct({'foo.bar': true}).bind(null, {}), /dots/)

  t.end()
})
