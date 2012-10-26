jAddressParser
==============

A Javascript/Coffeescript library to parse address strings into their constituent elements 

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

- Node.js (brew install node)
- Mocha (npm install -g mocha)
- Coffee-script (npm install -g coffee-script)



