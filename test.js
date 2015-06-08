'use strict'

var test = require('tape')
var obstruct = require('./')

test('obstruction', function (t) {
  t.deepEqual(obstruct({foo: true})({foo: 'bar'}), {
    foo: 'bar'
  }, 'passthrough')

  t.deepEqual(obstruct({foo: 'bar'})({foo: 'bar', bar: 'baz'}), {
    foo: 'baz'
  }, 'source key')

  t.deepEqual(obstruct({foo: 'a.bar'})({a: {bar: 'baz'}}), {
    foo: 'baz'
  }, 'dot props')

  function uppercase (string) {
    return string.toUpperCase()
  }
  t.deepEqual(obstruct({foo: uppercase})({foo: 'bar'}), {
    foo: 'BAR'
  }, 'fn transform')

  t.deepEqual(obstruct({foo: {bar: uppercase}})({foo: {bar: 'baz'}}), {
    foo: {bar: 'BAZ'}
  }, 'nested schemas')

  t.deepEqual(obstruct({a: ['foo', uppercase]})({foo: 'bar'}), {
    a: 'BAR'
  }, 'key change w/ fn transform')

  t.deepEqual(obstruct({b: ['foo.bar', uppercase]})({foo: {bar: 'baz'}}), {
    b: 'BAZ'
  }, 'dot key change w/ fn transform')

  t.deepEqual(obstruct({c: ['foo', {bar: uppercase}]})({foo: {bar: 'baz'}}), {
    c: {bar: 'BAZ'}
  }, 'key change w/ nested schema')

  t.deepEqual(obstruct({children: obstruct.array({name: uppercase})})({
    children: [{name: 'ben'}, {name: 'rachel'}]
  }), {
    children: [{name: 'BEN'}, {name: 'RACHEL'}]
  }, 'nested array')

  t.deepEqual(obstruct.array(uppercase)(['Yankees', 'Giants']), [
    'YANKEES',
    'GIANTS'
  ], 'mapping fn')

  var uppercaseItems = obstruct.array(uppercase)
  var required = obstruct({foo: uppercaseItems})
  var optional = obstruct({foo: obstruct.optional(uppercaseItems)})
  t.deepEqual(optional({foo: ['bar']}), {
    foo: ['BAR']
  })
  t.throws(required.bind(null, {}), 'normally throws')
  t.deepEqual(optional({}), {foo: undefined}, 'optional handles undefined value')

  t.deepEqual(obstruct({foo: true}, {foo: 'bar'}), {foo: 'bar'}, 'single call')

  var parse = obstruct({
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

  t.throws(obstruct, 'schema object is required')
  t.throws(obstruct({foo: ''}).bind(null, {}), /falsy values/)
  t.throws(obstruct({'foo.bar': true}).bind(null, {}), /dots/)

  t.end()
})
