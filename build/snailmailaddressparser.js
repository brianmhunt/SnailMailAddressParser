if (typeof require !== 'function') {
    // browser w/o dependency checking
    if (typeof XRegExp !== 'function') {
        console.log("No XRegExp object found - is it installed?.")
    }
    if (typeof _ !== 'function') {
        console.log("Underscore or lodash were not found. Is one installed?")
    }

    var define = function (deps, foo) {
        window.snailmailaddressparser = foo(_, {XRegExp: XRegExp});
    }
} else {
    if (typeof define !== 'function') {
        var define = require('amdefine')(module);
    }
}

define(['underscore', 'xregexp'], function (_, xregexp) {
  var XRegExp = xregexp.XRegExp;
/*  ---- Begin AMD content ---- */
/*
# This is the base class for all strategies
#
# TODO: Someday, think about how to get postal verification from the Universal
# Postal Union
#
# TODO: Address verification with eg Geocoder integration
*/

/*
#   AddressStrategy
#   ---------------
# << iso3166
#
# This class is intended to be subclassed, and expects parse_address to be
# overloaded. function should take a series of lines and return a simple
# JSONable object that adequately describes the components of the address.
#
# A given `subclass` should, after its definition, call subclass.register()
*/

var ALL_COUNTRY_IDS, AddressStrategy, COUNTRY_NAMES_MAP, CanadaStrategy, SnailMailAddressParser, iso3166,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AddressStrategy = (function() {

  function AddressStrategy() {}

  AddressStrategy._registered_strategies = {};

  /*
     * Register this subclass as a strategy
     * Maps @name to the subclass calling register (@name is the canonical
     * iso3166 name)
  */


  AddressStrategy.prototype.register = function() {
    var name;
    name = this.name.toLowerCase();
    if (!name) {
      throw new Error("Strategies require a `name`");
    }
    if (__indexOf.call(AddressStrategy._registered_strategies, name) >= 0) {
      throw new Error("Strategy " + name + " registered twice");
    }
    return AddressStrategy._registered_strategies[name] = this;
  };

  AddressStrategy.prototype.run_rex_line_strategy = function(regexes, addr_lines) {
    var result;
    result = {};
    if (regexes.length !== addr_lines.length) {
      throw new Error(("Parsing strategy expects " + regexes.length + " lines, but ") + ("the address has " + addr_lines.length + " lines."));
    }
    _.each(regexes, function(rex, index) {
      var EXCLUDED, matched_keys, matches;
      rex = XRegExp("^" + rex + "$", 'x');
      matches = XRegExp.exec(addr_lines[index], rex);
      if (matches === null) {
        throw new Error("Line " + index + " does not match " + rex);
      }
      EXCLUDED = ['index', 'input'];
      matched_keys = _.keys(matches);
      matched_keys = _.filter(matched_keys, function(s) {
        return isNaN(s) && __indexOf.call(EXCLUDED, s) < 0;
      });
      return _.each(matched_keys, function(key) {
        return result[key] = matches[key];
      });
    });
    return result;
  };

  AddressStrategy.prototype.run_line_strategies = function(strategies, addr_lines) {
    var results,
      _this = this;
    results = null;
    _.any(strategies, function(strat, index) {
      try {
        results = _this.run_rex_line_strategy(strat, addr_lines);
      } catch (err) {
        return false;
      }
      return results !== null;
    });
    return results;
  };

  AddressStrategy.prototype.debug_line_strategies = function(strategies, addr_lines) {
    var addr_str,
      _this = this;
    addr_str = _.map(addr_lines, function(line, idx) {
      return "" + idx + ": " + line;
    }).join("\n");
    console.log("\n** Debugging:\n" + addr_str);
    return _.each(strategies, function(strat, index) {
      var results;
      console.log("-- Strategy " + index + " --");
      try {
        return results = _this.run_rex_line_strategy(strat, addr_lines);
      } catch (err) {
        return console.log("Rex failed: " + err);
      }
    });
  };

  return AddressStrategy;

})();

AddressStrategy.do_parse_address = function(country, lines, address_string) {
  var strategy, _ref;
  if (_ref = !country, __indexOf.call(AddressStrategy._registered_strategies, _ref) >= 0) {
    throw new Error("No strategy to parse an address for " + country);
  }
  strategy = AddressStrategy._registered_strategies[country];
  return strategy.parse_address(lines, address_string);
};

/*
#   CanadaStrategy
#   --------------
# A way to parse Canadian addresses
#
# Reference: 'Addressing Guidelines'
# <http://www.canadapost.ca/tools/pg/manual/PGaddress-e.asp>
#
*/


CanadaStrategy = (function(_super) {
  var ADDRESSEE, MUNICIPALITY, MUNICIPALITY_WITH_POSTAL, POSTAL, STREET, STREET2, provinces_list;

  __extends(CanadaStrategy, _super);

  function CanadaStrategy() {
    return CanadaStrategy.__super__.constructor.apply(this, arguments);
  }

  CanadaStrategy.prototype.name = 'canada';

  provinces_list = ["AB", "Alberta", "BC", "British\\s+Columbia", "Manitoba", "MB", "New Brunswick", "NB", "Newfoundland\\s+and\\s+Labrador", "Newfoundland", "NF", "NL", "Newfoundland\\s+&\\s+Labrador", "Northwest Territories", "NT", "Nova Scotia", "NS", "Nunavut", "NU", "ON", "Ontario", "Prince\\s+Edward\\s+Island", "PE", "PEI", "Quebec", "QC", "Saskatchewan", "SK", "Yukon", "YT"];

  ADDRESSEE = "(?<addressee> [\\w\\s-\\.]+)";

  STREET = "(?:(?<suite> [^-]+) \\s* - \\s*)?    (?<street_number> \\d+)? \\s+    (?<street_name> .*?) \\s*";

  STREET2 = "(.*)";

  MUNICIPALITY = "    (?<municipality> \\w[\\w\\s\.]+?) \\s* ,? \\s*    (?<province> " + (provinces_list.join("|")) + ") \\s*";

  POSTAL = "(?<postal> \s*\\w\\d\\w\\s*\\d\\w\\d)";

  MUNICIPALITY_WITH_POSTAL = "" + MUNICIPALITY + " \\s* ,? \\s* " + POSTAL;

  /*
    # Parse an address into components
  */


  CanadaStrategy.prototype.parse_address = function(lines, address_string) {
    var fields, line_strats, results;
    fields = {
      suite: '',
      addressee: '',
      street_number: '',
      street_name_2: '',
      municipality: '',
      province: '',
      postal: '',
      country: 'Canada'
    };
    if (lines.length < 2) {
      throw new Error("Canadian addresses must be at least two lines.");
    }
    line_strats = [];
    line_strats.push([ADDRESSEE, STREET, STREET2, MUNICIPALITY, POSTAL]);
    line_strats.push([ADDRESSEE, STREET, MUNICIPALITY, POSTAL]);
    line_strats.push([STREET, STREET2, MUNICIPALITY, POSTAL]);
    line_strats.push([STREET, MUNICIPALITY, POSTAL]);
    line_strats.push([ADDRESSEE, STREET, STREET2, MUNICIPALITY_WITH_POSTAL]);
    line_strats.push([ADDRESSEE, STREET, MUNICIPALITY_WITH_POSTAL]);
    line_strats.push([STREET, STREET2, MUNICIPALITY_WITH_POSTAL]);
    line_strats.push([STREET, MUNICIPALITY_WITH_POSTAL]);
    results = this.run_line_strategies(line_strats, lines) || {};
    if (_.isEmpty(results)) {
      this.debug_line_strategies(line_strats, lines);
    }
    return _.defaults(results, fields);
  };

  return CanadaStrategy;

})(AddressStrategy);

new CanadaStrategy().register();

/*
 * ISO 3166 country codes
 *
 * See eg https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes
*/


iso3166 = [
  {
    name: "Afghanistan",
    aliases: ["AF"]
  }, {
    name: "Åland Islands",
    aliases: ["AX", "Aland Islands"]
  }, {
    name: "Albania",
    aliases: ["AL"]
  }, {
    name: "Algeria",
    aliases: ["DZ"]
  }, {
    name: "American Samoa",
    aliases: ["AS"]
  }, {
    name: "Andorra",
    aliases: ["AD"]
  }, {
    name: "Angola",
    aliases: ["AO"]
  }, {
    name: "Anguilla",
    aliases: ["AI"]
  }, {
    name: "Antarctica",
    aliases: ["AQ"]
  }, {
    name: "Antigua and Barbuda",
    aliases: ["AG"]
  }, {
    name: "Argentina",
    aliases: ["AR"]
  }, {
    name: "Armenia",
    aliases: ["AM"]
  }, {
    name: "Aruba",
    aliases: ["AW"]
  }, {
    name: "Australia",
    aliases: ["AU"]
  }, {
    name: "Austria",
    aliases: ["AT"]
  }, {
    name: "Azerbaijan",
    aliases: ["AZ"]
  }, {
    name: "Bahamas",
    aliases: ["BS"]
  }, {
    name: "Bahrain",
    aliases: ["BH"]
  }, {
    name: "Bangladesh",
    aliases: ["BD"]
  }, {
    name: "Barbados",
    aliases: ["BB"]
  }, {
    name: "Belarus",
    aliases: ["BY"]
  }, {
    name: "Belgium",
    aliases: ["BE"]
  }, {
    name: "Belize",
    aliases: ["BZ"]
  }, {
    name: "Benin",
    aliases: ["BJ"]
  }, {
    name: "Bermuda",
    aliases: ["BM"]
  }, {
    name: "Bhutan",
    aliases: ["BT"]
  }, {
    name: "Bolivia, Plurinational State of",
    aliases: ["BO", "Bolivia"]
  }, {
    name: "Bonaire, Sint Eustatius and Saba",
    aliases: ["BQ"]
  }, {
    name: "Bosnia and Herzegovina",
    aliases: ["BA"]
  }, {
    name: "Botswana",
    aliases: ["BW"]
  }, {
    name: "Bouvet Island",
    aliases: ["BV"]
  }, {
    name: "Brazil",
    aliases: ["BR"]
  }, {
    name: "British Indian Ocean Territory",
    aliases: ["IO"]
  }, {
    name: "Brunei Darussalam",
    aliases: ["BN"]
  }, {
    name: "Bulgaria",
    aliases: ["BG"]
  }, {
    name: "Burkina Faso",
    aliases: ["BF"]
  }, {
    name: "Burundi",
    aliases: ["BI"]
  }, {
    name: "Cambodia",
    aliases: ["KH"]
  }, {
    name: "Cameroon",
    aliases: ["CM"]
  }, {
    name: "Canada",
    aliases: ["CA"]
  }, {
    name: "Cape Verde",
    aliases: ["CV"]
  }, {
    name: "Cayman Islands",
    aliases: ["KY"]
  }, {
    name: "Central African Republic",
    aliases: ["CF"]
  }, {
    name: "Chad",
    aliases: ["TD"]
  }, {
    name: "Chile",
    aliases: ["CL"]
  }, {
    name: "China",
    aliases: ["CN"]
  }, {
    name: "Christmas Island",
    aliases: ["CX"]
  }, {
    name: "Cocos (Keeling) Islands",
    aliases: ["CC"]
  }, {
    name: "Colombia",
    aliases: ["CO"]
  }, {
    name: "Comoros",
    aliases: ["KM"]
  }, {
    name: "Congo",
    aliases: ["CG"]
  }, {
    name: "Congo, the Democratic Republic of the",
    aliases: ["CD"]
  }, {
    name: "Cook Islands",
    aliases: ["CK"]
  }, {
    name: "Costa Rica",
    aliases: ["CR"]
  }, {
    name: "Côte d'Ivoire",
    aliases: ["CI"]
  }, {
    name: "Croatia",
    aliases: ["HR"]
  }, {
    name: "Cuba",
    aliases: ["CU"]
  }, {
    name: "Curaçao",
    aliases: ["CW"]
  }, {
    name: "Cyprus",
    aliases: ["CY"]
  }, {
    name: "Czech Republic",
    aliases: ["CZ"]
  }, {
    name: "Denmark",
    aliases: ["DK"]
  }, {
    name: "Djibouti",
    aliases: ["DJ"]
  }, {
    name: "Dominica",
    aliases: ["DM"]
  }, {
    name: "Dominican Republic",
    aliases: ["DO"]
  }, {
    name: "Ecuador",
    aliases: ["EC"]
  }, {
    name: "Egypt",
    aliases: ["EG"]
  }, {
    name: "El Salvador",
    aliases: ["SV"]
  }, {
    name: "Equatorial Guinea",
    aliases: ["GQ"]
  }, {
    name: "Eritrea",
    aliases: ["ER"]
  }, {
    name: "Estonia",
    aliases: ["EE"]
  }, {
    name: "Ethiopia",
    aliases: ["ET"]
  }, {
    name: "Falkland Islands (Malvinas)",
    aliases: ["FK"]
  }, {
    name: "Faroe Islands",
    aliases: ["FO"]
  }, {
    name: "Fiji",
    aliases: ["FJ"]
  }, {
    name: "Finland",
    aliases: ["FI"]
  }, {
    name: "France",
    aliases: ["FR"]
  }, {
    name: "French Guiana",
    aliases: ["GF"]
  }, {
    name: "French Polynesia",
    aliases: ["PF"]
  }, {
    name: "French Southern Territories",
    aliases: ["TF"]
  }, {
    name: "Gabon",
    aliases: ["GA"]
  }, {
    name: "Gambia",
    aliases: ["GM"]
  }, {
    name: "Georgia",
    aliases: ["GE"]
  }, {
    name: "Germany",
    aliases: ["DE"]
  }, {
    name: "Ghana",
    aliases: ["GH"]
  }, {
    name: "Gibraltar",
    aliases: ["GI"]
  }, {
    name: "Greece",
    aliases: ["GR"]
  }, {
    name: "Greenland",
    aliases: ["GL"]
  }, {
    name: "Grenada",
    aliases: ["GD"]
  }, {
    name: "Guadeloupe",
    aliases: ["GP"]
  }, {
    name: "Guam",
    aliases: ["GU"]
  }, {
    name: "Guatemala",
    aliases: ["GT"]
  }, {
    name: "Guernsey",
    aliases: ["GG"]
  }, {
    name: "Guinea",
    aliases: ["GN"]
  }, {
    name: "Guinea-Bissau",
    aliases: ["GW"]
  }, {
    name: "Guyana",
    aliases: ["GY"]
  }, {
    name: "Haiti",
    aliases: ["HT"]
  }, {
    name: "Heard Island and McDonald Islands",
    aliases: ["HM"]
  }, {
    name: "Holy See (Vatican City State)",
    aliases: ["VA"]
  }, {
    name: "Honduras",
    aliases: ["HN"]
  }, {
    name: "Hong Kong",
    aliases: ["HK"]
  }, {
    name: "Hungary",
    aliases: ["HU"]
  }, {
    name: "Iceland",
    aliases: ["IS"]
  }, {
    name: "India",
    aliases: ["IN"]
  }, {
    name: "Indonesia",
    aliases: ["ID"]
  }, {
    name: "Iran, Islamic Republic of",
    aliases: ["IR"]
  }, {
    name: "Iraq",
    aliases: ["IQ"]
  }, {
    name: "Ireland",
    aliases: ["IE"]
  }, {
    name: "Isle of Man",
    aliases: ["IM"]
  }, {
    name: "Israel",
    aliases: ["IL"]
  }, {
    name: "Italy",
    aliases: ["IT"]
  }, {
    name: "Jamaica",
    aliases: ["JM"]
  }, {
    name: "Japan",
    aliases: ["JP"]
  }, {
    name: "Jersey",
    aliases: ["JE"]
  }, {
    name: "Jordan",
    aliases: ["JO"]
  }, {
    name: "Kazakhstan",
    aliases: ["KZ"]
  }, {
    name: "Kenya",
    aliases: ["KE"]
  }, {
    name: "Kiribati",
    aliases: ["KI"]
  }, {
    name: "Korea, Democratic People's Republic of",
    aliases: ["KP"]
  }, {
    name: "Korea, Republic of",
    aliases: ["KR"]
  }, {
    name: "Kuwait",
    aliases: ["KW"]
  }, {
    name: "Kyrgyzstan",
    aliases: ["KG"]
  }, {
    name: "Lao People's Democratic Republic",
    aliases: ["LA"]
  }, {
    name: "Latvia",
    aliases: ["LV"]
  }, {
    name: "Lebanon",
    aliases: ["LB"]
  }, {
    name: "Lesotho",
    aliases: ["LS"]
  }, {
    name: "Liberia",
    aliases: ["LR"]
  }, {
    name: "Libya",
    aliases: ["LY"]
  }, {
    name: "Liechtenstein",
    aliases: ["LI"]
  }, {
    name: "Lithuania",
    aliases: ["LT"]
  }, {
    name: "Luxembourg",
    aliases: ["LU"]
  }, {
    name: "Macao",
    aliases: ["MO"]
  }, {
    name: "Macedonia, the former Yugoslav Republic of",
    aliases: ["MK"]
  }, {
    name: "Madagascar",
    aliases: ["MG"]
  }, {
    name: "Malawi",
    aliases: ["MW"]
  }, {
    name: "Malaysia",
    aliases: ["MY"]
  }, {
    name: "Maldives",
    aliases: ["MV"]
  }, {
    name: "Mali",
    aliases: ["ML"]
  }, {
    name: "Malta",
    aliases: ["MT"]
  }, {
    name: "Marshall Islands",
    aliases: ["MH"]
  }, {
    name: "Martinique",
    aliases: ["MQ"]
  }, {
    name: "Mauritania",
    aliases: ["MR"]
  }, {
    name: "Mauritius",
    aliases: ["MU"]
  }, {
    name: "Mayotte",
    aliases: ["YT"]
  }, {
    name: "Mexico",
    aliases: ["MX"]
  }, {
    name: "Micronesia, Federated States of",
    aliases: ["FM"]
  }, {
    name: "Moldova, Republic of",
    aliases: ["MD"]
  }, {
    name: "Monaco",
    aliases: ["MC"]
  }, {
    name: "Mongolia",
    aliases: ["MN"]
  }, {
    name: "Montenegro",
    aliases: ["ME"]
  }, {
    name: "Montserrat",
    aliases: ["MS"]
  }, {
    name: "Morocco",
    aliases: ["MA"]
  }, {
    name: "Mozambique",
    aliases: ["MZ"]
  }, {
    name: "Myanmar",
    aliases: ["MM"]
  }, {
    name: "Namibia",
    aliases: ["NA"]
  }, {
    name: "Nauru",
    aliases: ["NR"]
  }, {
    name: "Nepal",
    aliases: ["NP"]
  }, {
    name: "Netherlands",
    aliases: ["NL"]
  }, {
    name: "New Caledonia",
    aliases: ["NC"]
  }, {
    name: "New Zealand",
    aliases: ["NZ"]
  }, {
    name: "Nicaragua",
    aliases: ["NI"]
  }, {
    name: "Niger",
    aliases: ["NE"]
  }, {
    name: "Nigeria",
    aliases: ["NG"]
  }, {
    name: "Niue",
    aliases: ["NU"]
  }, {
    name: "Norfolk Island",
    aliases: ["NF"]
  }, {
    name: "Northern Mariana Islands",
    aliases: ["MP"]
  }, {
    name: "Norway",
    aliases: ["NO"]
  }, {
    name: "Oman",
    aliases: ["OM"]
  }, {
    name: "Pakistan",
    aliases: ["PK"]
  }, {
    name: "Palau",
    aliases: ["PW"]
  }, {
    name: "Palestinian Territory, Occupied",
    aliases: ["PS"]
  }, {
    name: "Panama",
    aliases: ["PA"]
  }, {
    name: "Papua New Guinea",
    aliases: ["PG"]
  }, {
    name: "Paraguay",
    aliases: ["PY"]
  }, {
    name: "Peru",
    aliases: ["PE"]
  }, {
    name: "Philippines",
    aliases: ["PH"]
  }, {
    name: "Pitcairn",
    aliases: ["PN"]
  }, {
    name: "Poland",
    aliases: ["PL"]
  }, {
    name: "Portugal",
    aliases: ["PT"]
  }, {
    name: "Puerto Rico",
    aliases: ["PR"]
  }, {
    name: "Qatar",
    aliases: ["QA"]
  }, {
    name: "Réunion",
    aliases: ["RE"]
  }, {
    name: "Romania",
    aliases: ["RO"]
  }, {
    name: "Russian Federation",
    aliases: ["RU"]
  }, {
    name: "Rwanda",
    aliases: ["RW"]
  }, {
    name: "Saint Barthélemy",
    aliases: ["BL"]
  }, {
    name: "Saint Helena, Ascension and Tristan da Cunha",
    aliases: ["SH"]
  }, {
    name: "Saint Kitts and Nevis",
    aliases: ["KN"]
  }, {
    name: "Saint Lucia",
    aliases: ["LC"]
  }, {
    name: "Saint Martin (French part)",
    aliases: ["MF"]
  }, {
    name: "Saint Pierre and Miquelon",
    aliases: ["PM"]
  }, {
    name: "Saint Vincent and the Grenadines",
    aliases: ["VC"]
  }, {
    name: "Samoa",
    aliases: ["WS"]
  }, {
    name: "San Marino",
    aliases: ["SM"]
  }, {
    name: "Sao Tome and Principe",
    aliases: ["ST"]
  }, {
    name: "Saudi Arabia",
    aliases: ["SA"]
  }, {
    name: "Senegal",
    aliases: ["SN"]
  }, {
    name: "Serbia",
    aliases: ["RS"]
  }, {
    name: "Seychelles",
    aliases: ["SC"]
  }, {
    name: "Sierra Leone",
    aliases: ["SL"]
  }, {
    name: "Singapore",
    aliases: ["SG"]
  }, {
    name: "Sint Maarten (Dutch part)",
    aliases: ["SX"]
  }, {
    name: "Slovakia",
    aliases: ["SK"]
  }, {
    name: "Slovenia",
    aliases: ["SI"]
  }, {
    name: "Solomon Islands",
    aliases: ["SB"]
  }, {
    name: "Somalia",
    aliases: ["SO"]
  }, {
    name: "South Africa",
    aliases: ["ZA"]
  }, {
    name: "South Georgia and the South Sandwich Islands",
    aliases: ["GS"]
  }, {
    name: "South Sudan",
    aliases: ["SS"]
  }, {
    name: "Spain",
    aliases: ["ES"]
  }, {
    name: "Sri Lanka",
    aliases: ["LK"]
  }, {
    name: "Sudan",
    aliases: ["SD"]
  }, {
    name: "Suriname",
    aliases: ["SR"]
  }, {
    name: "Svalbard and Jan Mayen",
    aliases: ["SJ"]
  }, {
    name: "Swaziland",
    aliases: ["SZ"]
  }, {
    name: "Sweden",
    aliases: ["SE"]
  }, {
    name: "Switzerland",
    aliases: ["CH"]
  }, {
    name: "Syrian Arab Republic",
    aliases: ["SY"]
  }, {
    name: "Taiwan, Province of China",
    aliases: ["TW"]
  }, {
    name: "Tajikistan",
    aliases: ["TJ"]
  }, {
    name: "Tanzania, United Republic of",
    aliases: ["TZ"]
  }, {
    name: "Thailand",
    aliases: ["TH"]
  }, {
    name: "Timor-Leste",
    aliases: ["TL"]
  }, {
    name: "Togo",
    aliases: ["TG"]
  }, {
    name: "Tokelau",
    aliases: ["TK"]
  }, {
    name: "Tonga",
    aliases: ["TO"]
  }, {
    name: "Trinidad and Tobago",
    aliases: ["TT"]
  }, {
    name: "Tunisia",
    aliases: ["TN"]
  }, {
    name: "Turkey",
    aliases: ["TR"]
  }, {
    name: "Turkmenistan",
    aliases: ["TM"]
  }, {
    name: "Turks and Caicos Islands",
    aliases: ["TC"]
  }, {
    name: "Tuvalu",
    aliases: ["TV"]
  }, {
    name: "Uganda",
    aliases: ["UG"]
  }, {
    name: "Ukraine",
    aliases: ["UA"]
  }, {
    name: "United Arab Emirates",
    aliases: ["AE"]
  }, {
    name: "United Kingdom",
    aliases: ["GB"]
  }, {
    name: "United States",
    aliases: ["US", "USA", "United States of America"]
  }, {
    name: "United States Minor Outlying Islands",
    aliases: ["UM"]
  }, {
    name: "Uruguay",
    aliases: ["UY"]
  }, {
    name: "Uzbekistan",
    aliases: ["UZ"]
  }, {
    name: "Vanuatu",
    aliases: ["VU"]
  }, {
    name: "Venezuela, Bolivarian Republic of",
    aliases: ["VE"]
  }, {
    name: "Viet Nam",
    aliases: ["VN"]
  }, {
    name: "Virgin Islands, British",
    aliases: ["VG"]
  }, {
    name: "Virgin Islands, U.S.",
    aliases: ["VI"]
  }, {
    name: "Wallis and Futuna",
    aliases: ["WF"]
  }, {
    name: "Western Sahara",
    aliases: ["EH"]
  }, {
    name: "Yemen",
    aliases: ["YE"]
  }, {
    name: "Zambia",
    aliases: ["ZM"]
  }, {
    name: "Zimbabwe",
    aliases: ["ZW"]
  }
];

ALL_COUNTRY_IDS = _.flatten(_.map(iso3166, function(c) {
  return [c.name, c.aliases];
}));

COUNTRY_NAMES_MAP = {};

_.each(iso3166, function(country) {
  var name;
  name = country.name.toLowerCase();
  COUNTRY_NAMES_MAP[name] = name;
  return _.each(country.aliases, function(alias) {
    return COUNTRY_NAMES_MAP[alias.toLowerCase()] = name;
  });
});

({
  COUNTRIES_REX: XRegExp("(" + (_.keys(iso3166).join("|")) + ")")
});

SnailMailAddressParser = (function() {

  function SnailMailAddressParser(defaultCountry) {
    this._defaultCountry = defaultCountry;
  }

  SnailMailAddressParser.prototype.AddressStrategy = AddressStrategy;

  SnailMailAddressParser.prototype.parse = function(str, defaultCountry) {
    var canonical_name, country, last_line, lines, parsed;
    if (!_.isString(str)) {
      throw new Error("Address must be a string, got " + (typeof str) + ".");
    }
    lines = _.filter(_.map(str.split('\n'), function(aline) {
      return aline.trim();
    }), _.identity);
    if (lines.length < 2) {
      throw new Error("Addresses must be at least two lines long");
    }
    last_line = lines[lines.length - 1];
    if (__indexOf.call(ALL_COUNTRY_IDS, last_line) >= 0) {
      country = lines.pop();
    } else if (defaultCountry) {
      country = defaultCountry;
    } else {
      country = this.defaultCountry;
    }
    if (!country) {
      throw new Error("Address parsing cannot determine what country to use");
    }
    canonical_name = COUNTRY_NAMES_MAP[country.toLowerCase()];
    parsed = AddressStrategy.do_parse_address(canonical_name, lines, str);
    return parsed;
  };

  return SnailMailAddressParser;

})();

/*  ---- End AMD content ---- */
  return new SnailMailAddressParser();
});