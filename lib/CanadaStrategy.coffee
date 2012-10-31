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
    valid_tests: {
      "Mary Swånson":
        addressee: "Mary Swånson"
    },
    invalid_tests: [
      "100 Sampsonite Drive"
    ]
  )

  street_rex = """
   (?<street_number> \\d+)? \\s+
   (?<street_name> (?: \\p{L}|[\\.\\s\\-'])+? )
  """

  PLAIN_STREET = new LineMatcher "Plain street",
    street_rex,
    valid_tests: {
      "42 Wallaby Lane":
        street_number: "42"
        street_name: "Wallaby Lane"
      "100 Hûntley Street":
        street_number: "100"
        street_name: "Hûntley Street"
    }, invalid_tests: [
      "Wallaby Lane",
      "Suite 100, 42 Wallaby Lane",
      "42 Wallaby Lane, fl. 2-00",
    ]
  
  unit = """
    (?: apt\\.? | apartment | unit | suite | floor | fl\\.? | ) \\s* [#]? \\s*
  """

  UNIT_STREET = new LineMatcher "Unit - Street",
     "(?<suite> [^-]+?) \\s* [\\-,] \\s* #{street_rex}",
     valid_tests: {
       "Suite 1100a - 42 Wallaby Ave.":
         suite: "Suite 1100a"
         street_number: "42"
         street_name: "Wallaby Ave."
     }, invalid_tests: [
        "100 Wish Line, Unit #212",
        "Any street with no unit"
     ]

  STREET_UNIT = new LineMatcher "Street - Unit",
     "#{street_rex} \\s* [,\\-]? \\s* (?<suite> #{unit} [\\d\\w]+)",
     valid_tests: {
       "42 Wallaby Ave., Suite 1100A":
         suite: "Suite 1100A"
         street_number: "42"
         street_name: "Wallaby Ave."
       "1 Rainy Road #115":
         suite: "#115"
         street_number: "1"
         street_name: "Rainy Road"
     }, invalid_tests: [
        "100 100 100",
        "Any street with no unit"
     ]

  STREET2 = new LineMatcher("Second street line",
    "(?<street_name_2> .+)",
    valid_tests: {
      "Anything":
        street_name_2: "Anything"
    }, invalid_tests: [
      ""
    ])

    # XXX: Note that [\p{L}xyz] is *EXTRAORDINARILY* slow. Use (?:\p{L}|xyz)
  MUNICIPALITY = new LineMatcher("Municipality and Province",
    "(?<municipality> (?:\\p{L}|[\\-'\\s\\.])+?) \\s* ,? \\s*
     (?<province> #{provinces_list.join("|")})",
     valid_tests: {
       "Bras-d'Or, NS":
         municipality: "Bras-d'Or"
         province: 'NS'
       "St. Pétersberg, ON":
         municipality: "St. Pétersberg"
         province: "ON"
       "Hudsonville, QC":
         municipality: "Hudsonville"
         province: "QC"
     },
     invalid_tests: [
        "St. Peteresberg, Peterborough, 10005"
     ]
  )

  POSTAL = new LineMatcher("Postal code",
    "(?<postal> \s*\\w\\d\\w\\s*\\d\\w\\d)",
    valid_tests: {
      "H0H0H0":
        postal: 'H0H0H0'
      "H0H  0H0":
        postal: 'H0H  0H0'
    },
    invalid_tests: [
      "HoH 0H0",
      "HoH 0ü0" # (!unicode)
    ]
  )

  MUNICIPALITY_WITH_POSTAL = new LineMatcher(
    "Municipality, province and postal code",
    "#{MUNICIPALITY.expression} (?: \\s* ,? \\s* #{POSTAL.expression})?",
    valid_tests: {
      "One, QC, M5R 1V2":
        municipality: "One"
        province: "QC"
        postal: "M5R 1V2"
      "TreeTree, MB":
        municipality: "TreeTree"
        province: "MB"
        postal: undefined
    }, invalid_tests: [
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
    lms = new LineMatcherStrategy()
    lms.add(ADDRESSEE.optional(),
            PLAIN_STREET.or(UNIT_STREET).or(STREET_UNIT),
            STREET2.optional(),
            MUNICIPALITY, POSTAL)
    lms.add(ADDRESSEE.optional(),
            PLAIN_STREET.or(UNIT_STREET).or(STREET_UNIT),
            STREET2.optional(),
            MUNICIPALITY_WITH_POSTAL)
    return lms.all()

new CanadaStrategy().register()

