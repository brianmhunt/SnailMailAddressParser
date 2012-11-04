###
#   CanadaStrategy
#   --------------
# A way to parse Canadian addresses
#
# Reference: 'Addressing Guidelines'
# <http://www.canadapost.ca/tools/pg/manual/PGaddress-e.asp> 2012-11-01
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

  # non-exhaustive list of street types
  # (unused; my rexes took too long)
  street_types = [
    "Abbey", "ABBEY", "Acres", "ACRES", "Alley", "ALLEY", "Autoroute", "AUT",
    "Avenue", "AVE", "Avenue", "AV", "Bay", "BAY", "Beach", "BEACH", "Bend",
    "BEND", "Boulevard", "BLVD", "Boulevard", "BOUL", "building", "By-pass",
    "BYPASS", "Byway", "BYWAY", "Campus", "CAMPUS", "Cape", "CAPE", "CAR",
    "Carrefour", "CARREF", "Centre", "CTR", "Centre", "C", "Cercle", "CERCLE",
    "Chase", "CHASE", "Chemin", "CH", "Circle", "CIR", "Circuit", "CIRCT",
    "Close", "CLOSE", "Common", "COMMON", "Concession", "CONC", "Corners",
    "CRNRS", "Cour", "COUR", "Cours", "COURS", "Court", "CRT", "Cove", "COVE",
    "Crescent", "CRES", "Croissant", "CROIS", "Crossing", "CROSS",
    "Cul-de-sac", "CDS", "Dale", "DALE", "Dell", "DELL", "Diversion", "DIVERS",
    "Downs", "DOWNS", "Drive", "DR", "End", "END", "Esplanade", "ESPL",
    "Estates", "ESTATE", "Expressway", "EXPY", "Extension", "EXTEN", "Farm",
    "FARM", "Field", "FIELD", "Forest", "FOREST", "Freeway", "FWY", "Front",
    "FRONT", "Gardens", "GDNS", "Gate", "GATE", "Glade", "GLADE", "Glen",
    "GLEN", "Green", "GREEN", "Grounds", "GRNDS", "Grove", "GROVE", "Harbour",
    "HARBR", "Heath", "HEATH", "Heights", "HTS", "Highlands", "HGHLDS",
    "Highway", "HWY", "Hill", "HILL", "Hollow", "HOLLOW", "Impasse", "IMP",
    "Inlet", "INLET", "Island", "ISLAND", "Key", "KEY", "Knoll", "KNOLL",
    "Landing", "LANDNG", "Lane", "LANE", "Limits", "LMTS", "Line", "LINE",
    "Link", "LINK", "Lookout", "LKOUT", "Loop", "LOOP", "Mall", "MALL",
    "Manor", "MANOR", "Maze", "MAZE", "Meadow", "MEADOW", "Mews", "MEWS",
    "Moor", "MOOR", "Mount", "MOUNT", "Mountain", "MTN", "Orchard", "ORCH",
    "Parade", "PARADE", "Parc", "PARC", "Park", "PK", "Parkway", "PKY",
    "Passage", "PASS", "Path", "PATH", "Pathway", "PTWAY", "Pines", "PINES",
    "Place", "PL", "Place", "PLACE", "Plateau", "PLAT", "Plaza", "PLAZA",
    "Point", "PT", "Pointe", "POINTE", "Port", "PORT", "Private", "PVT",
    "Promenade", "PROM", "Quai", "QUAI", "Quay", "QUAY", "Ramp", "RAMP",
    "Rang", "RANG", "Range", "RG", "Ridge", "RIDGE", "Rise", "RISE", "Road",
    "RD", "Rond-point", "RDPT", "Route", "RTE", "Row", "ROW", "Rue", "RUE",
    "Ruelle", "RLE", "Run", "RUN", "Sentier", "SENT", "Square", "SQ", "Street",
    "ST", "Subdivision", "SUBDIV", "Terrace", "TERR", "Terrasse", "TSSE",
    "Thicket", "THICK", "Towers", "TOWERS", "Townline", "TLINE", "Trail",
    "TRAIL", "Turnabout", "TRNABT", "Vale", "VALE", "Via", "VIA", "View",
    "VIEW", "Village", "VILLGE", "Villas", "VILLAS", "Vista", "VISTA", "Voie",
    "VOIE", "Walk", "WALK", "Way", "WAY", "Wharf", "WHARF", "Wood", "WOOD",
    "Wynd", "WYND",
  ]

  person_rex = "(?: \\p{L} | [\\s\\-\\.])+ "

  ADDRESSEE = new LineMatcher("Addressee",
    "(?<addressee> #{person_rex})",
    valid_tests: {
      "Mary Swånson":
        addressee: "Mary Swånson"
    }, invalid_tests: [
      "100 Sampsonite Drive"
    ]
  )

  CARE_OF = new LineMatcher "Care of (c/o)",
    "(?: c/o | ℅) \\s+ (?<care_of> #{person_rex})",
    valid_tests: {
      "c/o Sinterklaas":
        care_of: "Sinterklaas"
    }, invalid_tests: [
      "no c/o? fine. be that way."
    ]

  street_rex = """
  (?<street_number> \\d+) \\s+
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
      "Wallaby 12 Lane",
      "Suite 100, 42 Wallaby Lane",
      "42 Wallaby Lane, fl. 2-00",
    ]

  unit = """
    (?:
      (?:
        (?: apt\\.? | apartment | unit | suite | floor | fl\\.? | app | bureau )
          \\s* (?: \\s [#] | no\\.? | number \s+ )?
        | [#]
        | no\\.
      )
      \\s*
        [\\d\\w]+
    |
      [\\d\\w]+
      \\s*
      (?: floor | fl\\. )
    )
  """

  UNIT_STREET = new LineMatcher "Unit - Street",
     "(?<suite> #{unit}|\\d+) \\s* [\\-,\\s] \\s* #{street_rex}",
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
     "#{street_rex} \\s* [,\\-]? \\s* (?<suite> #{unit})",
     valid_tests: {
       "42 Wallaby Ave., Suite 1100A":
         suite: "Suite 1100A"
         street_number: "42"
         street_name: "Wallaby Ave."
       "1 Rainy Road #115":
         suite: "#115"
         street_number: "1"
         street_name: "Rainy Road"
       # TODO / FIXME "Beothuk Building, 4th Floor":
       #street_number: undefined
       # street_name: "Beothuk Building"
       # suite: "4th Floor"
     }, invalid_tests: [
        "100 100 100",
        "Any street without a given unit"
     ]

  PO_BOX = new LineMatcher "Post Office Box",
    """(?<po_box>P\\.?\\s* O\\.?\\s* BOX \\s* \\s* \\d+ \\s* ,? \\s*
       (?: (?:stn\\.?|station|rpo\\.?|rr\\.?) \\s* \\w+)? )""",

    valid_tests: {
      "PO Box 1200":
        po_box: "PO Box 1200"
      "P.O. Box 1200 stn A":
        po_box: "P.O. Box 1200 stn A"
      "P.O. Box 39, RR1":
        po_box: "P.O. Box 39, RR1"
    }, invalid_tests: [
      "No PO",
    ]

  MORE_ADDR_INFO = new LineMatcher "Additional Address Anformation",
    "(?<additional_address_info> .+)",
    valid_tests: {
      "Anything":
        additional_address_info: "Anything"
    }, invalid_tests: [
      ""
    ]

  SUITE = new LineMatcher "Suite number",
    "(?<suite> #{unit})",
    valid_tests: {
      'Suite # 1024':
        suite: 'Suite # 1024'
    }, invalid_tests: [
      '10 10'
    ]

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
      care_of: ''
      street_number: ''
      street_name: ''
      additional_address_info: ''
      po_box: ''
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

    street = PLAIN_STREET.or(UNIT_STREET).or(STREET_UNIT).or(PO_BOX).or(SUITE)

    lms.add(ADDRESSEE.optional(),
            CARE_OF.optional(),
            street.optional(),
            street,
            MUNICIPALITY, POSTAL)

    lms.add(ADDRESSEE.optional(),
            CARE_OF.optional(),
            street.optional(),
            street,
            MUNICIPALITY_WITH_POSTAL)

    lms.add(ADDRESSEE,
            MORE_ADDR_INFO.optional(),
            CARE_OF.optional(),
            street.optional(),
            street,
            MUNICIPALITY, POSTAL)

    lms.add(ADDRESSEE,
            MORE_ADDR_INFO.optional(),
            CARE_OF.optional(),
            street.optional(),
            street,
            MUNICIPALITY_WITH_POSTAL)


    return lms.all()

new CanadaStrategy().register()

