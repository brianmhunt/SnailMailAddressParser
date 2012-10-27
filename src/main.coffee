###
# Main
#
# Returns the jAddressParser object
###

if typeof define != 'function'
  define = require('amdefine')(module)

define [
  './iso3166',
  'underscore', # or lodash - drop-in replacement
  'cs!./canada',
], ->
  iso3166 = require('iso3166')

  # the following is a list of all possible names of all countries
  ALL_COUNTRY_IDS = _.flatten(_.map(iso3166, (c) -> [c.name, c.aliases]))

  # the following maps aliases and names onto the canonical country name
  # eg. USA: United States; United States: United States, etc.
  COUNTRY_NAMES_MAP = {}

  _.each(iso3166, (country) ->
    name = country.name.toLowerCase()

    COUNTRY_NAMES_MAP[name] = name

    _.each(country.aliases, (alias) ->
      COUNTRY_NAMES_MAP[alias.toLowerCase()] = name
    )
  )

  #
  # country_parser_map maps a country to the respective file
  #
  # Each file should be an AMD module that returns an object (or class)
  # with a 'parser' function. The parser function should take a series
  # of lines and return a simple JSONable object that adequately describes the
  # components of the address.
  #
  # The comments at the beginning of each file should set up the type of
  # addresses it accepts, and indicate what data is (or may be) returned.
  #
  country_parser_map =
    'canada': 'cs!./canada'

  #
  # This is the class returned by main.coffee
  #
  jAddressParser = class
    constructor: (defaultCountry) ->
      @_string = s
      @_defaultCountry = defaultCountry

    parse: (str, defaultCountry) ->
      if not _.isString(str)
        throw new Error("Address must be a string")

      # split the address into usable lines
      # - skip any empty space
      # - trimtespace  lines
      lines = _.filter(_.map(str.split('\n'), (s) -> e.trim()))

      if lines.length < 2
        throw new Error("Addresses must be at least two lines long")

      last_line = lines[lines.length - 1]
      if last_line in ALL_COUNTRY_IDS
        # we've been given a country.
        country = lines.pop() # do not pass the country to the parser
      else if defaultCountry
        # use the default argument to this function
        country = defaultCountry
      else
        # use the country passed in with the constructor
        country = @defaultCountry

      if not country
        throw new Error("Address parsing cannot determine what country to use")

      # convert from eg 'Canada' to 'canada' or "CA" to 'ca'
      canonical_name = COUNTRY_NAMES_MAP[country.toLowerCase()]

      country_parser_required = country_parser_map[canonical_name]

      try
        require(country_parser_required).parse(lines)
      catch err
        console.log("Invalid address: #{err}")
        throw new Error("Invalid address: #{err}")

      return parsed
      
  return jAddressParser

