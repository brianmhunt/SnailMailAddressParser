###
# This is the base class for all strategies
#
# TODO: get postal verification from the Universal Postal Union
#
# TODO: Address verification with eg Geocoder integration
#
# TODO: Make the Perl gods happy by outputting a big, evil regular expression
#
# TODO: Return an object that has multiple ambiguous addresses (i.e. matches
# multiple destinations)
###

###
#   AddressStrategy
#   ---------------
#
# This class is intended to be subclassed.  The `do_parse_address` function
# should take a series of lines and return a simple JSONable object that
# adequately describes the components of the address.
#
# A given `subclass` should, after its definition, call subclass.register()
###
class AddressStrategy
  @_registered_strategies = {}

  ###
   * Register this subclass as a strategy
   * Maps @name to the subclass calling register (@name is the canonical
   * iso3166 name)
  ###
  register: ->
    name = @name.toLowerCase()

    if not name
      throw new Error("Strategies require a `name`")

    if name in AddressStrategy._registered_strategies
      throw new Error("Strategy #{name} registered twice")

    AddressStrategy._registered_strategies[name] = @

  @all_strategies: ->
    return @_registered_strategies

  #
  # Given a set of regular expressions, see if each one applies to the given
  # `lines`, in order, and return the results if it matches - otherwise
  # throw an error. Fields is a list of named fields copied to the result.
  #
  # @param: regexes - a list of regular expressions, one corresponding to each
  #         line
  # @ param: a list of lines of the address
  #
  run_rex_line_strategy: (matcher_array, addr_lines) ->
    result = {}

    if matcher_array.length != addr_lines.length
      throw new Error("Matcher expects #{matcher_array.length} lines," +
        " but the address has #{addr_lines.length} lines.")

    _.each(matcher_array, (line_strategy, index) ->
      matches = line_strategy.match(addr_lines[index])

      if matches == null
        throw new Error("Line #{index} is not a valid #{line_strategy.name}")

      _.extend(result, matches)
      # _.each matches, (key) -> result[key] = matches[key]
    )

    return result

  # try every strategy on addr_lines
  run_line_strategies: (strategies, addr_lines) ->
    results = null

    # early out. TODO: Return multiple results (if conflicting)
    _.any(strategies, (strat, index) =>
      try
        results = @run_rex_line_strategy(strat, addr_lines)
      catch err
        # console.log "Strategy #{index} failed: #{err}"
        return false
      return results != null
    )
    return results

  debug_line_strategies: (strategies, addr_lines) ->
    addr_str = _.map(addr_lines, (line, idx) -> "#{idx}: #{line}").join("\n")
    console.log("\n** Debugging:\n#{addr_str}")

    _.each(strategies, (strat, index) =>
      console.log "Skipping strategy #{index}; mismatched line count"
      # silently skip strategies that correspond to different line counts
      if strat.length != addr_lines.length
        return

      try
        results = @run_rex_line_strategy(strat, addr_lines)
      catch err
        console.log "Rex failed: #{err}"
        #line = parseInt(err) # line no is the problem
        #rex = strat[line] # the regular expression that failed
        #console.log "Line #{line}: \"#{addr_lines[line]}\" " +
        #  "does not match /^#{rex}$/ (#{err})"
    )

  #
  # parse_address
  # ~~~~~~~~~~~~~
  #
  # Given lines/address, parse it components.
  # Address_string is provided as a backup, in case a 'lines' strategy is not
  # workable.
  #
  parse_address: (lines, address_string) ->
    if lines.length < 2
      throw new Error("Addresses must be at least two lines.")

    line_strats = @line_strategies() or []

    results = @run_line_strategies(line_strats, lines) or {}

    # TODO: check if we are in debug mode, and only dump this info when we are
    if _.isEmpty(results)
      @debug_line_strategies(line_strats, lines)
    
    return _.defaults(results, @expected_fields())

AddressStrategy.do_parse_address = (addr_string, options) ->
  options = _.defaults(options,
    defaultCountry: ''
    debug: false
  )

  strategies = []
  matches = []

  # split the address into usable lines
  # - skip any empty space
  # - trim whitespace from lines
  lines = _.filter(_.map(
    addr_string.split('\n'), (aline) -> aline.trim()), _.identity
  )

  if lines.length < 2
    # this may be a Western convention.
    throw new Error("Addresses must be at least two lines long")

  # First, we need to get the country. It should be the last line of the
  # address, but if the last line is not a recognized country then we use
  # the defaultCountry passed as an argument or alternatively the
  # defaultCountry passed as an argument to the constructor of this class.
  last_line = lines[lines.length - 1]
  if last_line.toLowerCase() in _.keys(COUNTRY_NAMES_MAP)
    # we've been given a country.
    country = lines.pop().toLowerCase()
  else if options.defaultCountry
    # use the default argument to this function
    country = options.defaultCountry

  if country
    # convert from eg 'Canada' to 'canada' or "CA" to 'ca'
    country_key = COUNTRY_NAMES_MAP[country.toLowerCase()]

    if country_key in _.keys(AddressStrategy._registered_strategies)
      strategies = [AddressStrategy._registered_strategies[country_key]]

  if _.isEmpty(strategies)
    # O_RLY? Try every country.
    strategies = _.values(AddressStrategy._registered_strategies)

  for strat in strategies
    matches.push(strat.parse_address(lines, addr_string, options.debug))

  return { matches: _.flatten(matches) }

