SnailMailAddressParser
======================

[![Build Status](https://travis-ci.org/brianmhunt/SnailMailAddressParser.png)](https://travis-ci.org/brianmhunt/SnailMailAddressParser)


A Javascript library for parsing valid address strings into their constituent
elements.

SnailMailAddressParse has a page for testing over at:
[brianmhunt/SnailMailAddressParser](http://brianmhunt.github.com/SnailMailAddressParser/).

Purpose
-------

This project exists to crowdsource the difficult problem of parsing addresses.
It is intended to assist with the verification that addresses are properly
formatted, and where they are properly formatted to parse and return their
respective constituents.

At the moment this project does not aim to verify that an address is consistent
with reality. For example, this library shall not verify that a given address
in California has a Californian zip-code.

Usage
-----

An example in `node.js`:

    > smap = require('snailmailaddressparser')

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

### `smap = require('snailmailaddressparser')`

Return an instance of the Address Parser.

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
expected fields, and the tests are in easilly accessible .yaml files.

Browser Installation
--------------------

To install on the browser you can simply copy `build/snailmailaddressparser.js`
or `build/snailmailaddressparser.min.js` to your project and include it in your
project with eg the RequireJS `require('snailmailaddressparser')`.

- [lodash](https://github.com/bestiejs/lodash) 
- [XRegExp](http://xregexp.com/)
- AMD eg [requirejs](http://requirejs.org/) and `require('snailmailaddressparser')`
  or `<script src='snailmailaddressparser.js'></script>` tag

Requirements for testing
------------------------

- Node.js: `brew install node`
  With [Homebrew](http://mxcl.github.com/homebrew/)

- Coffee-script `npm install -g coffee-script`

Install with `npm install snailmailaddressparser`. To run the build one will
need `cake`, which is part of Coffee-script. One can install Coffee-script
with `npm-install -g coffee-script`.

Cakefile targets
----------------

#### `cake toast`

Convert the coffeescript in the `lib/` directory into a usable javascript AMD
modules `build/snailmailaddressparser.js` and 
`build/snailmailaddressparser.min.js` by calling `cake toast`.

#### `cake test`

Run [Mocha](http://visionmedia.github.com/mocha/)-based tests on the project.

Fun tip: You can combine targets e.g. run `cake toast test` to build then test.

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

