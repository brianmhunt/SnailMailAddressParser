SnailMailAddressParser
======================

[![Build Status](https://travis-ci.org/brianmhunt/SnailMailAddressParser.png)](https://travis-ci.org/brianmhunt/SnailMailAddressParser)


A Javascript library for parsing valid address strings into their constituent elements.

It is hosted on GitHub at
[brianmhunt/SnailMailAddressParser](http://brianmhunt.github.com/SnailMailAddressParser/).

Purpose
-------

This project exists to crowdsource the difficult problem of parsing addresses. It is intended to assist with the verification that addresses are properly formatted, and where they are properly formatted to parse and return their respective constituents.

At the moment this project does not aim to verify that an address is consistent with reality. For example, this library shall not verify that a given address in California has a local zip-code.

Usage
-----

An example in `node.js`:

    > smap = require('SnailMailAddressParser')

    > smap.parse("100 Bay Street\nToronto, ON M5H 1T1\nCanada")
    { suite: '',
      addressee: '',
      street_number: '100',
      street_name_2: '',
      municipality: 'Toronto',
      province: 'ON',
      postal: 'M5H 1T1',
      country: 'Canada',
      street_name: 'Bay Street' }

API
---

### `smap = require('SnailMailAddressParser')`

Return an instance of the Address Parser. Uses the
[amdefine](https://github.com/jrburke/amdefine) module for Node.js
compatibility.

### `smap.parse(address_string, defaultCountry)`

Parse the `address_string`, returning an object or throwing an exception where
the address cannot be parsed.

If the `address_string` ends in a valid country name, that country is used,
otherwise `defaultCountry` is used.

The object returned will contain the elements corresponding to the given
country.

**TODO** Where the `address_string` is ambiguous, return a message indicating
that the string is ambiguous, and provide the multiple matching results so that
the user can choose which is correct.

Contributing
------------

Drop me a message or send along a pull request on GitHub. I would be delighted
to co-ordinate support for addresses that may interest you.

The project is intended to divide-and-conquer. Each country has a strategy for
parsing addresses, which strategy may be broken down into a variety of
sub-strategies. In this way, I hope edge cases can eventually be shored up.

The built-in tests allow for easy verification that addresses return the
expected fields. See for example `test/canada.coffee`.

Browser Installation
--------------------

To install on the browser you can simply copy `build/SnailMailAddressParser.js`
or `build/SnailMailAddressParser.min.js` to your project and include it in your
project with eg the RequireJS `require('jAddressParser')`.

- [lodash](https://github.com/bestiejs/lodash) (or [underscore](http://underscorejs.org/))
- [XRegExp](http://xregexp.com/)
- AMD eg [requirejs](http://requirejs.org/)

Requirements for testing
------------------------

With [Homebrew](http://mxcl.github.com/homebrew/)

- Node.js: `brew install node`
- Coffee-script `npm install -g coffee-script`

Once 'npm' and coffee-script installed, you can run `cake deps` to install the
remaining npm packages.

Cakefile targets
----------------

#### `cake toast`

Convert the coffeescript in the `lib/` directory into a usable javascript AMD
modules `build/SnailMailAddressParser.js` and 
`build/SnailMailAddressParser.min.js` by calling `cake toast`.

#### `cake test`

Run [Mocha](http://visionmedia.github.com/mocha/)-based tests on the project.

### `cake deps`

Install dependencies in the `node_modules` subdirectory of the project.

Future
------

It is challenging to correctly parse the plethora of possible addresses, so
contributions to the parsing and testing are most welcome.

Some ideas for future builds includes:

- Integration with libraries or services that provide address verification
- Geocoding integration

License
-------

This project is licensed under the MIT license, which is included as LICENSE in
the source.
