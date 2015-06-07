'use strict'

var test = require('tape')
var obstruct = require('./')

test(function (t) {
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
  })
  t.end()
})
