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

  ADDRESSEE = new LineMatcher("Addressee", "(?<addressee> [\\p{L}\\s-\\.]+)",
    valid_tests: [
      "Mary Swånson", # (unicode)
    ],
    invalid_tests: [
      "100 Sampsonite Drive"
    ]
  )

  STREET = new LineMatcher("Street", "(?:(?<suite> [^-]+) \\s* - \\s*)?
    (?<street_number> \\d+)? \\s+
    (?<street_name> .*?)",
    valid_tests: [
      "100 huntley street",
      "Ünit 215 - 100 Huntley Street" # (unicode)
    ],
    invalid_tests: [
      "Wallaby Lane"
    ]
  )

  STREET2 = new LineMatcher("Second street line", "(.+)",
    valid_tests: [
      "Anything"
    ], invalid_tests: [
      ""
    ])

  MUNICIPALITY = new LineMatcher("Municipality and Province",
    "(?<municipality> [\\p{L}\\s\\.]+?) \\s* ,? \\s*
     (?<province> #{provinces_list.join("|")})",
     valid_tests: [
        "St. Pétersberg, ON", # (unicode)
        "Hudsonville, QC",
     ],
     invalid_tests: [
        "St. Peteresberg, Peterborough, 10005"
     ]
  )

  POSTAL = new LineMatcher("Postal code",
    "(?<postal> \s*\\w\\d\\w\\s*\\d\\w\\d)",
    valid_tests: [
      "H0H0H0",
      "H0H  0H0",
    ],
    invalid_tests: [
      "HoH 0H0",
      "HoH 0ü0" # (!unicode)
    ]
  )

  MUNICIPALITY_WITH_POSTAL = new LineMatcher(
    "Municipality, province and postal code",
    "#{MUNICIPALITY.expression} (?: \\s* ,? \\s* #{POSTAL.expression})?",
    valid_tests: [
      "One, QC, M5R 1V2",
      "Two Tee, ON"
    ], invalid_tests: [
      "Two, Two, Two"
    ]
  
  )

  # Return an object with the fields we expect (and defaults)
  expected_fields: ->
    return {
      suite: ''
      addressee: ''
      street_number: ''
      street_name_2: ''
      municipality: ''
      province: ''
      postal: ''
      country: 'Canada'
    }

  #
  # Return a list of line strategies that this country strategy employs
  #
  line_strategies: ->
    line_strats = []
    line_strats.push([ADDRESSEE, STREET, STREET2, MUNICIPALITY, POSTAL])
    line_strats.push([ADDRESSEE, STREET,          MUNICIPALITY, POSTAL])
    line_strats.push([           STREET, STREET2, MUNICIPALITY, POSTAL])
    line_strats.push([           STREET,          MUNICIPALITY, POSTAL])
    line_strats.push([ADDRESSEE, STREET, STREET2, MUNICIPALITY_WITH_POSTAL])
    line_strats.push([ADDRESSEE, STREET,          MUNICIPALITY_WITH_POSTAL])
    line_strats.push([           STREET, STREET2, MUNICIPALITY_WITH_POSTAL])
    line_strats.push([           STREET,          MUNICIPALITY_WITH_POSTAL])
    return line_strats

new CanadaStrategy().register()

