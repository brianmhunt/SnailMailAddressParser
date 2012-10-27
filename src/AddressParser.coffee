#
# Requires
# --------
#<<src/iso3166
#<<src/strategy
#

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

jAddressParser = class
  constructor: (defaultCountry) ->
    @_string = s
    @_defaultCountry = defaultCountry

  parse: (str, defaultCountry) ->
    if not _.isString(str)
      throw new Error("Address must be a string")

    # split the address into usable lines
    # - skip any empty space
    # - trim whitespace from lines
    lines = _.filter(_.map(str.split('\n'), (s) -> e.trim()))

    if lines.length < 2
      throw new Error("Addresses must be at least two lines long")

    # First, we need to get the country. It should be the last line of the
    # address, but if the last line is not a recognized country then we use
    # the defaultCountry passed as an argument or alternatively the
    # defaultCountry passed as an argument to the constructor of this class.
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

    try
      # pass both lines and the address string in - no need to duplicate the
      # common strategy of splitting lines repeatedly; and similarly, it may be
      # useful for some strategies to have the original string.
      AddressStrategy.do_parse_address(canonical_name, lines, str)
    catch err
      console.log("Invalid address: #{err}")
      throw new Error("Invalid address: #{err}")

    return parsed

