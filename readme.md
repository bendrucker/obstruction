# obstruction [![Build Status](https://travis-ci.org/bendrucker/obstruction.svg?branch=master)](https://travis-ci.org/bendrucker/obstruction)

> Declarative parser for remapping object schemas and data

## Install

```
$ npm install --save obstruction
```


## Usage

```js
var obstruct = require('obstruction')
var parse = obstruct({
  title: 'name',
  description: true,
  author: 'author.login'
})
parse({
  name: 'Obstruction',
  description: 'Object restructuring and parsing',
  author: {
    login: 'bendrucker'
  }
})
```

Returns:

```js
{
  title: 'Obstruction',
  description: 'Object restructuring and parsing',
  author: 'bendrucker'
}
```

## API

#### `obstruct(schema, [object])` -> `function` / `object`

If only a schema is passed, a function with the `schema` partially applied will be returned. You can call that function with your `object`.

##### schema

*Required*  
Type: `object`

A schema object. See the [schema definition options](#schema-definition) for more details.

##### object

Type: `object`  

The object to parse. If omitted, a partially applied function will be returned instead.

#### `obstruct.array(schema)` -> `function`

A convenience function for easily mapping arrays over a schema.

##### schema

*Required*  
Type: `object` / `function`

The schema used to map array items. This can be a plain object (which will be passed to `obstruct`) or the result of calling `obstruct(schema)` earlier. It can also any generic function for mapping values. The following are equivalent:

Without `obstruct.array`:

```js
var parseState = obstruct({
  abbrevation: 'abbrev'
})
obstruct({
  states: function (states) {
    return states.map(function (state) {
      return parseState(state)
    })
  }
})
```

With `obstruct.array`:

```js
obstruct({
  states: obstruct.array({
    abbreviation: 'abbrev'
  })
})
```

## Schema Definitions

A schema object represents the target object structure after parsing. You can nest schema objects to re-map nested objects. Schema nodes (the values in the schema object) control what value ultimately appears at a particular keypath in the final object.

Schema nodes can be:

#### `true`

The value will be copied directly from the source object:

```js
obstruct({foo: true})({foo: 'bar'})
// => {foo: 'bar'}
```

#### a string

The value will be copied from the source object using the supplied string as the source key:

```js
obstruct({foo: 'bar'})({foo: 'bar', bar: 'baz'})
// => {foo: 'baz'}
```

Strings can also use dot syntax to access deep properties:

```js
obstruct({foo: 'a.bar'})({a: {bar: 'baz'}})
// => {foo: 'baz'}
```

#### a function

The value from the source object will be passed through the supplied function:

```js
function uppercase (string) {
  return string.toUpperCase()
}
obstruct({foo: uppercase})({foo: 'bar'})
// => {foo: 'BAR'}
```

The function also receives the original object as the second argument.

#### an object

`obstruct` is called with the object and the source value at that keypath.

```js
obstruct({foo: {bar: uppercase}})({foo: {bar: 'baz'}})
// => {foo: {bar: 'BAZ'}}
```

#### an array

Schema nodes can be an array where:

* the first value is the source key to use (dot syntax is supported)
* the second value is any other valid schema node value (`true`, string, function, object)

```js
obstruct({a: ['foo', uppercase]})({foo: 'bar'})
// => {a: 'BAR'}
obstruct({b: ['foo.bar', uppercase]})({foo: {bar: 'baz'}})
// => {b: 'BAZ'}
obstruct({c: ['foo', {bar: uppercase}]})({foo: {bar: 'baz'}})
// => {c: {bar: 'BAZ'}}
```

## License

MIT © [Ben Drucker](http://bendrucker.me)
