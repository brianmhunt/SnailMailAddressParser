###
#   CanadaStrategy
#   --------------
# A way to parse Canadian addresses
#
# Reference: 'Addressing Guidelines'
# <http://www.canadapost.ca/tools/pg/manual/PGaddress-e.asp>
#
###
#
#
class CanadaStrategy extends AddressStrategy
  name: 'canada'

  provinces_list = [
    "AB", "Alberta",
    "BC", "British\\s+Columbia",
    "Manitoba", "MB",
    "New Brunswick", "NB",
    "Newfoundland\\s+and\\s+Labrador", "Newfoundland", "NF", "NL",
    "Newfoundland\\s+&\\s+Labrador",
    "Northwest Territories", "NT",
    "Nova Scotia", "NS",
    "Nunavut", "NU",
    "ON", "Ontario",
    "Prince\\s+Edward\\s+Island", "PE", "PEI",
    "Quebec", "QC",
    "Saskatchewan", "SK",
    "Yukon", "YT",
  ]

  ADDRESSEE = "(?<addressee> [\\w\\s-\\.]+)"

  STREET = "(?:(?<suite> [^-]+) \\s* - \\s*)?
    (?<street_number> \\d+)? \\s+
    (?<street_name> .*?) \\s*"

  STREET2 = "(.*)"

  MUNICIPALITY ="
    (?<municipality> \\w[\\w\\s\.]+?) \\s* ,? \\s*
    (?<province> #{provinces_list.join("|")}) \\s*"

  POSTAL = "(?<postal> \s*\\w\\d\\w\\s*\\d\\w\\d)"

  MUNICIPALITY_WITH_POSTAL = "#{MUNICIPALITY} \\s* ,? \\s* #{POSTAL}"


  ###
  # Parse an address into components
  ###
  parse_address: (lines, address_string) ->
    # here are the components of the Canadian address
    fields =
      suite: ''
      addressee: ''
      street_number: ''
      street_name_2: ''
      municipality: ''
      province: ''
      postal: ''
      country: 'Canada'

    if lines.length < 2
      throw new Error("Canadian addresses must be at least two lines.")

    line_strats = []
    line_strats.push([ADDRESSEE, STREET, STREET2, MUNICIPALITY, POSTAL])
    line_strats.push([ADDRESSEE, STREET,          MUNICIPALITY, POSTAL])
    line_strats.push([           STREET, STREET2, MUNICIPALITY, POSTAL])
    line_strats.push([           STREET,          MUNICIPALITY, POSTAL])
    line_strats.push([ADDRESSEE, STREET, STREET2, MUNICIPALITY_WITH_POSTAL])
    line_strats.push([ADDRESSEE, STREET,          MUNICIPALITY_WITH_POSTAL])
    line_strats.push([           STREET, STREET2, MUNICIPALITY_WITH_POSTAL])
    line_strats.push([           STREET,          MUNICIPALITY_WITH_POSTAL])

    results = @run_line_strategies(line_strats, lines) or {}

    # TODO: check if we are in debug mode, and only dump this info when we are
    if _.isEmpty(results)
      @debug_line_strategies(line_strats, lines)
    
    return _.defaults(results, fields)

new CanadaStrategy().register()

