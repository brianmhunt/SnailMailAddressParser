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


Requirements
------------

    - lodash
    - AMD/requirejs
    - XRegExp


