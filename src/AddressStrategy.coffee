###
# This is the base class for all strategies
#
# TODO: Someday, think about how to get postal verification from the Universal
# Postal Union
#
# TODO: Address verification with eg Geocoder integration
###
#
#
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

    if name in jAddressParser._registered_strategies
      throw new Error("Strategy #{name} registered twice")

    jAddressParser._registered_strategies[name] = @

AddressStrategy.do_parse_address = (country, lines, address_string) ->
  if not country in jAddressParser._registered_strategies
    throw new Error("No strategy to parse an address for #{country}")

  strategy = new jAddressParser._registered_strategies()

  log "Parsing address in #{country}."
  return strategy.parse_address(lines, address_string)
  
