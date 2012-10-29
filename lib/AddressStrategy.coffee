###
# This is the base class for all strategies
#
# TODO: Someday, think about how to get postal verification from the Universal
# Postal Union
#
# TODO: Address verification with eg Geocoder integration
###

###
#   AddressStrategy
#   ---------------
#
# This class is intended to be subclassed, and expects parse_address to be
# overloaded. function should take a series of lines and return a simple
# JSONable object that adequately describes the components of the address.
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



AddressStrategy.do_parse_address = (country, lines, address_string) ->
  if not country in AddressStrategy._registered_strategies
    throw new Error("No strategy to parse an address for #{country}")

  # console.log "Parsing address in #{country}."
  strategy = AddressStrategy._registered_strategies[country]
  return strategy.parse_address(lines, address_string)


