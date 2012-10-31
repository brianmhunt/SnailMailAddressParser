#
# AddressParser
# -------------
#
# This is the main class, exported as SnailMailAddressParser
#
#
# Requires
# ~~~~~~~~
#<< SnailMailAddressParser/*
#
class SnailMailAddressParser
  # expose for testing
  AddressStrategy: AddressStrategy
  LineMatcher: LineMatcher
  LineMatcherStrategy: LineMatcherStrategy
  Version: VERSION # via the Cakefile header, from package.json

  constructor: () ->

  parse: (str, options={}) ->
    if not _.isString(str)
      throw new Error("Address must be a string, got #{typeof str}.")

    return AddressStrategy.do_parse_address(str, options)

