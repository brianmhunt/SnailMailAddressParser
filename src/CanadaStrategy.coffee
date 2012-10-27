###
#   CanadaStrategy
#   --------------
# A way to parse Canadian addresses
#
# Reference: 'Addressing Guidelines'
# <http://www.canadapost.ca/tools/pg/manual/PGaddress-e.asp>
#
###
class CanadaStrategy extends AddressStrategy
  name: 'canada'

  provinces_list = [
    "AB", "Alberta",
    "BC", "British Columbia",
    "Manitoba", "MB",
    "New Brunswick", "NB",
    "Newfoundland and Labrador", "Newfoundland", "NF", "NL",
    "Northwest Territories", "NT",
    "Nova Scotia", "NS",
    "Nunavut", "NU",
    "ON", "Ontario",
    "Prince Edward Island", "PE",
    "Quebec", "QC",
    "Saskatchewan", "SK",
    "Yukon", "YT",
  ]

  CANADA_MUNI_REX = XRegExp("^\s*
    (?<muni> \\w[\\w\\s\.]+?) \\s* ,? \\s*
    (?<prov> #{provinces_list.join("|")}) \\s* ,? \\s*
    (?<postal> \\w\\d\\w\\s*\\d\\w\\d) \s*
    $", 'x')

  CANADA_STREET_REX = XRegExp("^\\s*
    (?:(?<suite> [^-]+) \\s* - \\s*)?
    (?<number> \\d+)? \\s+
    (?<name> .*?) \\s*
    $", 'x')

  ###
  # Parse an address into components
  #
  # Components are:
  #     addressee
  #     suite
  #     street_number
  #     street_name
  #     street_name_2
  #     municipality
  #     prov
  #     country
  #     postal_code
  #
  ###
  parse_address: (lines, address_string) ->
    # strip trailing/leading space and split the address into lines
    fields = {}

    if lines.length < 2
      throw new Error("Addresses must be at least two lines.")

    # start at the bottom (where formalities are greater) and parse our way up.
    #
    # the last line can be a country or a "Municipality Prov  Postal Code"
    last_line = lines.pop()
    
    if m = XRegExp.exec(last_line, CANADA_MUNI_REX)
      fields['municipality'] = m.muni
      fields['province'] = m.prov
      fields['postal'] = m.postal

      if 'country' not in fields
        fields['country'] = 'Canada'

    else
      # last line should be a country
      throw new Error("The last line should be 'Municipality Prov Postal code'")

    last_line = lines.pop()
    # TODO: Assert city is a. a sensible name, and/or b. an actual city name

    if m = XRegExp.exec(last_line, CANADA_STREET_REX)
      fields['suite'] = m.suite
      fields['street_number'] = m.number
      fields['street_name'] = m.name

    else
      fields['street_number_2'] = last_line

      if lines.length > 0
        last_line = lines.pop()

        if m = XRegExp.exec(last_line, CANADA_STREET_REX)
          fields['suite'] = m.suite
          fields['street_number'] = m.number
          fields['street_name'] = m.name
        else
          throw new Error("Line #{lines.length+1} was expected to be street
 'Suite - Street # Street name', but it is \"#{last_line}\"")
      else # we have no street!
        throw new Error("An address requires a street e.g. 'Suite - Street #
 Street name'")

    fields['addressee'] = lines.pop() or "" # may be undefined.

    if lines.length > 0
      throw new Error("This address has too many opening lines.")
      
    return fields

new CanadaStrategy().register()
