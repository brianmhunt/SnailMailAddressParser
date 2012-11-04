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
  var XRegExp = xregexp.XRegExp, VERSION;
  XRegExp.addUnicodePackage();
/*  ---- Begin AMD content ---- */
VERSION = "0.1.20-beta";
// -- from: lib/Debug.coffee -- \\
/*
#
# Some debugging utilities
#
*/

var inspect, log;

if (typeof module !== 'undefined' && module.exports) {
  inspect = function(o, showHidden, depth) {
    if (showHidden == null) {
      showHidden = false;
    }
    if (depth == null) {
      depth = 2;
    }
    return require('util').inspect(o, showHidden, depth, true);
  };
  log = function(string) {
    return require('util').debug(string);
  };
} else {
  inspect = function(o) {
    return console.log(o);
  };
  log = function(o) {
    return console.log(o);
  };
}


// -- from: lib/iso3166.coffee -- \\
/*
 * ISO 3166 country codes
 *
 * See eg https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes
*/

var ALL_COUNTRY_IDS, COUNTRIES_REX, COUNTRY_NAMES_MAP, iso3166;

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

COUNTRIES_REX = XRegExp("(" + (_.keys(iso3166).join("|")) + ")");


// -- from: lib/LineMatcherStrategy.coffee -- \\
var LineMatcherStrategy,
  __slice = [].slice;

LineMatcherStrategy = (function() {

  function LineMatcherStrategy() {
    this._list = [];
  }

  LineMatcherStrategy.prototype.add = function() {
    var line_matcher_list, permutations;
    line_matcher_list = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    permutations = [_.toArray(line_matcher_list)];
    _.each(line_matcher_list, function(lm, index) {
      var perms_wo_lm;
      if (!lm.is_optional()) {
        return;
      }
      perms_wo_lm = [];
      _.each(permutations, function(perm) {
        var matcher_set;
        matcher_set = _.clone(perm);
        matcher_set.splice(matcher_set.indexOf(lm), 1);
        return perms_wo_lm.push(matcher_set);
      });
      return permutations = permutations.concat(perms_wo_lm);
    });
    return this._list = this._list.concat(permutations);
  };

  LineMatcherStrategy.prototype.all = function() {
    return this._list;
  };

  return LineMatcherStrategy;

})();


// -- from: lib/LineMatcher.coffee -- \\
var LineMatcher,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

LineMatcher = (function() {

  function LineMatcher(name, expression, options) {
    this.name = name;
    this.expression = expression;
    if (options == null) {
      options = {};
    }
    this.options = _.defaults(options, {
      invalid_tests: [],
      is_optional: false,
      rex_flags: 'xi',
      valid_tests: [],
      _or: null
    });
    this.rex = XRegExp("^" + expression + "$", this.options.rex_flags);
  }

  LineMatcher.prototype.optional = function() {
    var copy;
    copy = _.clone(this);
    copy.options.is_optional = true;
    return copy;
  };

  LineMatcher.prototype.mandatory = function() {
    var copy;
    copy = _.clone(this);
    copy.options.is_optional = false;
    return copy;
  };

  LineMatcher.prototype.is_optional = function() {
    return this.options.is_optional;
  };

  LineMatcher.prototype.or = function(matcher) {
    var lm;
    lm = this;
    if (_.isObject(this.options._or)) {
      if (this.options._or.name === matcher.name) {
        return this;
      }
      this.options._or = this.options._or.or(matcher);
    } else {
      lm = _.clone(this);
      lm.options._or = matcher;
    }
    return lm;
  };

  LineMatcher.prototype.match = function(line, check_or) {
    var EXCLUDED, matched_properties, matches, _ref;
    if (check_or == null) {
      check_or = true;
    }
    matches = XRegExp.exec(line, this.rex);
    if (matches === null) {
      if (check_or) {
        return ((_ref = this.options._or) != null ? typeof _ref.match === "function" ? _ref.match(line) : void 0 : void 0) || null;
      } else {
        return check_or;
      }
    }
    EXCLUDED = ['index', 'input'];
    matched_properties = {};
    _.each(_.keys(matches), function(key) {
      if (__indexOf.call(EXCLUDED, key) < 0 && isNaN(key)) {
        return matched_properties[key] = matches[key];
      }
    });
    return matched_properties;
  };

  LineMatcher.prototype.isLineMatcherClass = true;

  return LineMatcher;

})();


// -- from: lib/AddressStrategy.coffee -- \\
/*
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
*/

/*
#   AddressStrategy
#   ---------------
#
# This class is intended to be subclassed.  The `do_parse_address` function
# should take a series of lines and return a simple JSONable object that
# adequately describes the components of the address.
#
# A given `subclass` should, after its definition, call subclass.register()
*/

var AddressStrategy,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

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

  AddressStrategy.all_strategies = function() {
    return this._registered_strategies;
  };

  AddressStrategy.prototype.run_rex_line_strategy = function(matcher_array, addr_lines) {
    var result;
    result = {};
    if (matcher_array.length !== addr_lines.length) {
      throw new Error(("Matcher expects " + matcher_array.length + " lines,") + (" but the address has " + addr_lines.length + " lines."));
    }
    _.each(matcher_array, function(line_strategy, index) {
      var matches;
      matches = line_strategy.match(addr_lines[index]);
      if (matches === null) {
        throw new Error("Line " + index + " is not a valid " + line_strategy.name);
      }
      return _.extend(result, matches);
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
      if (strat.length !== addr_lines.length) {
        return;
      }
      try {
        return results = _this.run_rex_line_strategy(strat, addr_lines);
      } catch (err) {
        return console.log("Rex failed: " + err);
      }
    });
  };

  AddressStrategy.prototype.parse_address = function(lines, address_string) {
    var line_strats, results;
    if (lines.length < 2) {
      throw new Error("Addresses must be at least two lines.");
    }
    line_strats = this.line_strategies() || [];
    results = this.run_line_strategies(line_strats, lines) || {};
    if (_.isEmpty(results)) {
      this.debug_line_strategies(line_strats, lines);
    }
    return _.defaults(results, this.expected_fields());
  };

  return AddressStrategy;

})();

AddressStrategy.do_parse_address = function(addr_string, options) {
  var country, country_key, last_line, lines, matches, strat, strategies, _i, _len, _ref;
  options = _.defaults(options, {
    defaultCountry: '',
    debug: false
  });
  strategies = [];
  matches = [];
  lines = _.filter(_.map(addr_string.split('\n'), function(aline) {
    return aline.trim();
  }), _.identity);
  if (lines.length < 2) {
    throw new Error("Addresses must be at least two lines long");
  }
  last_line = lines[lines.length - 1];
  if (_ref = last_line.toLowerCase(), __indexOf.call(_.keys(COUNTRY_NAMES_MAP), _ref) >= 0) {
    country = lines.pop().toLowerCase();
  } else if (options.defaultCountry) {
    country = options.defaultCountry;
  }
  if (country) {
    country_key = COUNTRY_NAMES_MAP[country.toLowerCase()];
    if (__indexOf.call(_.keys(AddressStrategy._registered_strategies), country_key) >= 0) {
      strategies = [AddressStrategy._registered_strategies[country_key]];
    }
  }
  if (_.isEmpty(strategies)) {
    strategies = _.values(AddressStrategy._registered_strategies);
  }
  for (_i = 0, _len = strategies.length; _i < _len; _i++) {
    strat = strategies[_i];
    matches.push(strat.parse_address(lines, addr_string, options.debug));
  }
  return {
    matches: _.flatten(matches)
  };
};


// -- from: lib/CanadaStrategy.coffee -- \\
/*
#   CanadaStrategy
#   --------------
# A way to parse Canadian addresses
#
# Reference: 'Addressing Guidelines'
# <http://www.canadapost.ca/tools/pg/manual/PGaddress-e.asp> 2012-11-01
#
*/

var CanadaStrategy,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

CanadaStrategy = (function(_super) {
  var ADDRESSEE, CARE_OF, MUNICIPALITY, MUNICIPALITY_WITH_POSTAL, PLAIN_STREET, POSTAL, PO_BOX, STREET2, STREET_UNIT, SUITE, UNIT_STREET, person_rex, provinces_list, street_rex, street_types, unit;

  __extends(CanadaStrategy, _super);

  function CanadaStrategy() {
    return CanadaStrategy.__super__.constructor.apply(this, arguments);
  }

  CanadaStrategy.prototype.name = 'canada';

  provinces_list = ["AB", "Alberta", "BC", "British\\s+Columbia", "Manitoba", "MB", "New Brunswick", "NB", "Newfoundland\\s+and\\s+Labrador", "Newfoundland", "NF", "NL", "Newfoundland\\s+&\\s+Labrador", "Northwest Territories", "NT", "Nova Scotia", "NS", "Nunavut", "NU", "ON", "Ontario", "Prince\\s+Edward\\s+Island", "PE", "PEI", "Quebec", "QC", "Saskatchewan", "SK", "Yukon", "YT"];

  street_types = ["Abbey", "ABBEY", "Acres", "ACRES", "Alley", "ALLEY", "Autoroute", "AUT", "Avenue", "AVE", "Avenue", "AV", "Bay", "BAY", "Beach", "BEACH", "Bend", "BEND", "Boulevard", "BLVD", "Boulevard", "BOUL", "building", "By-pass", "BYPASS", "Byway", "BYWAY", "Campus", "CAMPUS", "Cape", "CAPE", "CAR", "Carrefour", "CARREF", "Centre", "CTR", "Centre", "C", "Cercle", "CERCLE", "Chase", "CHASE", "Chemin", "CH", "Circle", "CIR", "Circuit", "CIRCT", "Close", "CLOSE", "Common", "COMMON", "Concession", "CONC", "Corners", "CRNRS", "Cour", "COUR", "Cours", "COURS", "Court", "CRT", "Cove", "COVE", "Crescent", "CRES", "Croissant", "CROIS", "Crossing", "CROSS", "Cul-de-sac", "CDS", "Dale", "DALE", "Dell", "DELL", "Diversion", "DIVERS", "Downs", "DOWNS", "Drive", "DR", "End", "END", "Esplanade", "ESPL", "Estates", "ESTATE", "Expressway", "EXPY", "Extension", "EXTEN", "Farm", "FARM", "Field", "FIELD", "Forest", "FOREST", "Freeway", "FWY", "Front", "FRONT", "Gardens", "GDNS", "Gate", "GATE", "Glade", "GLADE", "Glen", "GLEN", "Green", "GREEN", "Grounds", "GRNDS", "Grove", "GROVE", "Harbour", "HARBR", "Heath", "HEATH", "Heights", "HTS", "Highlands", "HGHLDS", "Highway", "HWY", "Hill", "HILL", "Hollow", "HOLLOW", "Impasse", "IMP", "Inlet", "INLET", "Island", "ISLAND", "Key", "KEY", "Knoll", "KNOLL", "Landing", "LANDNG", "Lane", "LANE", "Limits", "LMTS", "Line", "LINE", "Link", "LINK", "Lookout", "LKOUT", "Loop", "LOOP", "Mall", "MALL", "Manor", "MANOR", "Maze", "MAZE", "Meadow", "MEADOW", "Mews", "MEWS", "Moor", "MOOR", "Mount", "MOUNT", "Mountain", "MTN", "Orchard", "ORCH", "Parade", "PARADE", "Parc", "PARC", "Park", "PK", "Parkway", "PKY", "Passage", "PASS", "Path", "PATH", "Pathway", "PTWAY", "Pines", "PINES", "Place", "PL", "Place", "PLACE", "Plateau", "PLAT", "Plaza", "PLAZA", "Point", "PT", "Pointe", "POINTE", "Port", "PORT", "Private", "PVT", "Promenade", "PROM", "Quai", "QUAI", "Quay", "QUAY", "Ramp", "RAMP", "Rang", "RANG", "Range", "RG", "Ridge", "RIDGE", "Rise", "RISE", "Road", "RD", "Rond-point", "RDPT", "Route", "RTE", "Row", "ROW", "Rue", "RUE", "Ruelle", "RLE", "Run", "RUN", "Sentier", "SENT", "Square", "SQ", "Street", "ST", "Subdivision", "SUBDIV", "Terrace", "TERR", "Terrasse", "TSSE", "Thicket", "THICK", "Towers", "TOWERS", "Townline", "TLINE", "Trail", "TRAIL", "Turnabout", "TRNABT", "Vale", "VALE", "Via", "VIA", "View", "VIEW", "Village", "VILLGE", "Villas", "VILLAS", "Vista", "VISTA", "Voie", "VOIE", "Walk", "WALK", "Way", "WAY", "Wharf", "WHARF", "Wood", "WOOD", "Wynd", "WYND"];

  person_rex = "(?: \\p{L} | [\\s\\-\\.])+ ";

  ADDRESSEE = new LineMatcher("Addressee", "(?<addressee> " + person_rex + ")", {
    valid_tests: {
      "Mary Swånson": {
        addressee: "Mary Swånson"
      }
    },
    invalid_tests: ["100 Sampsonite Drive"]
  });

  CARE_OF = new LineMatcher("Care of (c/o)", "(?: c/o | ℅) \\s+ (?<care_of> " + person_rex + ")", {
    valid_tests: {
      "c/o Sinterklaas": {
        care_of: "Sinterklaas"
      }
    },
    invalid_tests: ["no c/o? fine. be that way."]
  });

  street_rex = "(?<street_number> \\d+) \\s+\n(?<street_name> (?: \\p{L}|[\\.\\s\\-'])+? )";

  PLAIN_STREET = new LineMatcher("Plain street", street_rex, {
    valid_tests: {
      "42 Wallaby Lane": {
        street_number: "42",
        street_name: "Wallaby Lane"
      },
      "100 Hûntley Street": {
        street_number: "100",
        street_name: "Hûntley Street"
      }
    },
    invalid_tests: ["Wallaby 12 Lane", "Suite 100, 42 Wallaby Lane", "42 Wallaby Lane, fl. 2-00"]
  });

  unit = "(?:\n  (?:\n    (?: apt\\.? | apartment | unit | suite | floor | fl\\.? | app | bureau )\n      \\s* (?: \\s [#] | no\\.? | number \s+ )?\n    | [#]\n    | no\\.\n  )\n  \\s*\n    [\\d\\w]+\n|\n  [\\d\\w]+\n  \\s*\n  (?: floor | fl\\. )\n)";

  UNIT_STREET = new LineMatcher("Unit - Street", "(?<suite> " + unit + "|\\d+) \\s* [\\-,\\s] \\s* " + street_rex, {
    valid_tests: {
      "Suite 1100a - 42 Wallaby Ave.": {
        suite: "Suite 1100a",
        street_number: "42",
        street_name: "Wallaby Ave."
      }
    },
    invalid_tests: ["100 Wish Line, Unit #212", "Any street with no unit"]
  });

  STREET_UNIT = new LineMatcher("Street - Unit", "" + street_rex + " \\s* [,\\-]? \\s* (?<suite> " + unit + ")", {
    valid_tests: {
      "42 Wallaby Ave., Suite 1100A": {
        suite: "Suite 1100A",
        street_number: "42",
        street_name: "Wallaby Ave."
      },
      "1 Rainy Road #115": {
        suite: "#115",
        street_number: "1",
        street_name: "Rainy Road"
      }
    },
    invalid_tests: ["100 100 100", "Any street without a given unit"]
  });

  PO_BOX = new LineMatcher("Post Office Box", "(?<po_box>P\\.?\\s* O\\.?\\s* BOX \\s* \\s* \\d+ \\s* ,? \\s*\n(?: (?:stn\\.?|station|rpo\\.?|rr\\.?) \\s* \\w+)? )", {
    valid_tests: {
      "PO Box 1200": {
        po_box: "PO Box 1200"
      },
      "P.O. Box 1200 stn A": {
        po_box: "P.O. Box 1200 stn A"
      },
      "P.O. Box 39, RR1": {
        po_box: "P.O. Box 39, RR1"
      }
    },
    invalid_tests: ["No PO"]
  });

  STREET2 = new LineMatcher("Second street line", "(?<street_name_2> .+)", {
    valid_tests: {
      "Anything": {
        street_name_2: "Anything"
      }
    },
    invalid_tests: [""]
  });

  SUITE = new LineMatcher("Suite number", "(?<suite> " + unit + ")", {
    valid_tests: {
      'Suite # 1024': {
        suite: 'Suite # 1024'
      }
    },
    invalid_tests: ['10 10']
  });

  MUNICIPALITY = new LineMatcher("Municipality and Province", "(?<municipality> (?:\\p{L}|[\\-'\\s\\.])+?) \\s* ,? \\s*     (?<province> " + (provinces_list.join("|")) + ")", {
    valid_tests: {
      "Bras-d'Or, NS": {
        municipality: "Bras-d'Or",
        province: 'NS'
      },
      "St. Pétersberg, ON": {
        municipality: "St. Pétersberg",
        province: "ON"
      },
      "Hudsonville, QC": {
        municipality: "Hudsonville",
        province: "QC"
      }
    },
    invalid_tests: ["St. Peteresberg, Peterborough, 10005"]
  });

  POSTAL = new LineMatcher("Postal code", "(?<postal> \s*\\w\\d\\w\\s*\\d\\w\\d)", {
    valid_tests: {
      "H0H0H0": {
        postal: 'H0H0H0'
      },
      "H0H  0H0": {
        postal: 'H0H  0H0'
      }
    },
    invalid_tests: ["HoH 0H0", "HoH 0ü0"]
  });

  MUNICIPALITY_WITH_POSTAL = new LineMatcher("Municipality, province and postal code", "" + MUNICIPALITY.expression + " (?: \\s* ,? \\s* " + POSTAL.expression + ")?", {
    valid_tests: {
      "One, QC, M5R 1V2": {
        municipality: "One",
        province: "QC",
        postal: "M5R 1V2"
      },
      "TreeTree, MB": {
        municipality: "TreeTree",
        province: "MB",
        postal: void 0
      }
    },
    invalid_tests: ["Two, Two, Two"]
  });

  CanadaStrategy.prototype.expected_fields = function() {
    return {
      suite: '',
      addressee: '',
      care_of: '',
      street_number: '',
      street_name: '',
      street_name_2: '',
      po_box: '',
      municipality: '',
      province: '',
      postal: '',
      country: 'Canada'
    };
  };

  CanadaStrategy.prototype.line_strategies = function() {
    var lms;
    lms = new LineMatcherStrategy();
    lms.add(ADDRESSEE.optional(), CARE_OF.optional(), PLAIN_STREET, SUITE, MUNICIPALITY, POSTAL);
    lms.add(ADDRESSEE.optional(), CARE_OF.optional(), PLAIN_STREET, SUITE, MUNICIPALITY_WITH_POSTAL);
    lms.add(ADDRESSEE.optional(), CARE_OF.optional(), PLAIN_STREET.or(UNIT_STREET).or(STREET_UNIT).or(PO_BOX), STREET2.optional(), MUNICIPALITY, POSTAL);
    lms.add(ADDRESSEE.optional(), CARE_OF.optional(), PLAIN_STREET.or(UNIT_STREET).or(STREET_UNIT).or(PO_BOX), STREET2.optional(), MUNICIPALITY_WITH_POSTAL);
    return lms.all();
  };

  return CanadaStrategy;

})(AddressStrategy);

new CanadaStrategy().register();


// -- from: lib/SnailMailAddressParser.coffee -- \\
var SnailMailAddressParser;

SnailMailAddressParser = (function() {

  SnailMailAddressParser.prototype.AddressStrategy = AddressStrategy;

  SnailMailAddressParser.prototype.LineMatcher = LineMatcher;

  SnailMailAddressParser.prototype.LineMatcherStrategy = LineMatcherStrategy;

  SnailMailAddressParser.prototype.Version = VERSION;

  function SnailMailAddressParser() {}

  SnailMailAddressParser.prototype.parse = function(str, options) {
    if (options == null) {
      options = {};
    }
    if (!_.isString(str)) {
      throw new Error("Address must be a string, got " + (typeof str) + ".");
    }
    return AddressStrategy.do_parse_address(str, options);
  };

  return SnailMailAddressParser;

})();
/*  ---- End AMD content ---- */
  return new SnailMailAddressParser();
});