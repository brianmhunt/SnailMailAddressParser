jAddressParser
==============

A Javascript/Coffeescript library to parse address strings into their
constituent elements 

Usage
-----

In CoffeeScript:

    require ['jAddressParser'], (jAP) ->
      ap = new jAP(defaultCountry='Canada')
      addr = ap.parse("House of Commons\nParliament Buildings\nOttawa, ON K1A 0A6")
      # addr now contains structured data


Browser Requirements
--------------------

- [lodash](https://github.com/bestiejs/lodash)
- [XRegExp](http://xregexp.com/)
- AMD/[requirejs](http://requirejs.org/)
- [require-cs](https://github.com/jrburke/require-cs)

Requirements for testing
------------------------

With [Homebrew](http://mxcl.github.com/homebrew/)

- Node.js 

      brew install node

- Coffee-script 

      npm install -g coffee-script

Once 'npm' and coffee-script installed, you can run `cake deps` to install the
remaining npm packages.

Building
--------

Convert the coffeescript in the `src/` directory into a usable javascript
module by calling `cake build`. The output of the build is
`build/jAddressParser.js`.

TODO
----

1. Make it work. Build and test currently fail.
2. Wrap the `jAddressParser.js` result in a suitable wrapper such as 
   [UMD](https://github.com/umdjs/umd)
3. Move to a simpler build system (i.e. not r.js).


