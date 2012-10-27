(function() { if ('function' !== typeof define) { var define = require('amdefine')(module); }
define('coffee-script',{});
define('cs',{load: function(id){throw new Error("Dynamic load not allowed: " + id);}});
/*
 * ISO 3166 country codes
 * See eg https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes
 */

define('src/iso3166',[], [
   {name: "Afghanistan", aliases: ["AF"]},
   {name: "Åland Islands", aliases: ["AX", "Aland Islands"]},
   {name: "Albania", aliases: ["AL"]},
   {name: "Algeria", aliases: ["DZ"]},
   {name: "American Samoa", aliases: ["AS"]},
   {name: "Andorra", aliases: ["AD"]},
   {name: "Angola", aliases: ["AO"]},
   {name: "Anguilla", aliases: ["AI"]},
   {name: "Antarctica", aliases: ["AQ"]},
   {name: "Antigua and Barbuda", aliases: ["AG"]},
   {name: "Argentina", aliases: ["AR"]},
   {name: "Armenia", aliases: ["AM"]},
   {name: "Aruba", aliases: ["AW"]},
   {name: "Australia", aliases: ["AU"]},
   {name: "Austria", aliases: ["AT"]},
   {name: "Azerbaijan", aliases: ["AZ"]},
   {name: "Bahamas", aliases: ["BS"]},
   {name: "Bahrain", aliases: ["BH"]},
   {name: "Bangladesh", aliases: ["BD"]},
   {name: "Barbados", aliases: ["BB"]},
   {name: "Belarus", aliases: ["BY"]},
   {name: "Belgium", aliases: ["BE"]},
   {name: "Belize", aliases: ["BZ"]},
   {name: "Benin", aliases: ["BJ"]},
   {name: "Bermuda", aliases: ["BM"]},
   {name: "Bhutan", aliases: ["BT"]},
   {name: "Bolivia, Plurinational State of", aliases: ["BO", "Bolivia"]},
   {name: "Bonaire, Sint Eustatius and Saba", aliases: ["BQ"]},
   {name: "Bosnia and Herzegovina", aliases: ["BA"]},
   {name: "Botswana", aliases: ["BW"]},
   {name: "Bouvet Island", aliases: ["BV"]},
   {name: "Brazil", aliases: ["BR"]},
   {name: "British Indian Ocean Territory", aliases: ["IO"]},
   {name: "Brunei Darussalam", aliases: ["BN"]},
   {name: "Bulgaria", aliases: ["BG"]},
   {name: "Burkina Faso", aliases: ["BF"]},
   {name: "Burundi", aliases: ["BI"]},
   {name: "Cambodia", aliases: ["KH"]},
   {name: "Cameroon", aliases: ["CM"]},
   {name: "Canada", aliases: ["CA"]},
   {name: "Cape Verde", aliases: ["CV"]},
   {name: "Cayman Islands", aliases: ["KY"]},
   {name: "Central African Republic", aliases: ["CF"]},
   {name: "Chad", aliases: ["TD"]},
   {name: "Chile", aliases: ["CL"]},
   {name: "China", aliases: ["CN"]},
   {name: "Christmas Island", aliases: ["CX"]},
   {name: "Cocos (Keeling) Islands", aliases: ["CC"]},
   {name: "Colombia", aliases: ["CO"]},
   {name: "Comoros", aliases: ["KM"]},
   {name: "Congo", aliases: ["CG"]},
   {name: "Congo, the Democratic Republic of the", aliases: ["CD"]},
   {name: "Cook Islands", aliases: ["CK"]},
   {name: "Costa Rica", aliases: ["CR"]},
   {name: "Côte d'Ivoire", aliases: ["CI"]},
   {name: "Croatia", aliases: ["HR"]},
   {name: "Cuba", aliases: ["CU"]},
   {name: "Curaçao", aliases: ["CW"]},
   {name: "Cyprus", aliases: ["CY"]},
   {name: "Czech Republic", aliases: ["CZ"]},
   {name: "Denmark", aliases: ["DK"]},
   {name: "Djibouti", aliases: ["DJ"]},
   {name: "Dominica", aliases: ["DM"]},
   {name: "Dominican Republic", aliases: ["DO"]},
   {name: "Ecuador", aliases: ["EC"]},
   {name: "Egypt", aliases: ["EG"]},
   {name: "El Salvador", aliases: ["SV"]},
   {name: "Equatorial Guinea", aliases: ["GQ"]},
   {name: "Eritrea", aliases: ["ER"]},
   {name: "Estonia", aliases: ["EE"]},
   {name: "Ethiopia", aliases: ["ET"]},
   {name: "Falkland Islands (Malvinas)", aliases: ["FK"]},
   {name: "Faroe Islands", aliases: ["FO"]},
   {name: "Fiji", aliases: ["FJ"]},
   {name: "Finland", aliases: ["FI"]},
   {name: "France", aliases: ["FR"]},
   {name: "French Guiana", aliases: ["GF"]},
   {name: "French Polynesia", aliases: ["PF"]},
   {name: "French Southern Territories", aliases: ["TF"]},
   {name: "Gabon", aliases: ["GA"]},
   {name: "Gambia", aliases: ["GM"]},
   {name: "Georgia", aliases: ["GE"]},
   {name: "Germany", aliases: ["DE"]},
   {name: "Ghana", aliases: ["GH"]},
   {name: "Gibraltar", aliases: ["GI"]},
   {name: "Greece", aliases: ["GR"]},
   {name: "Greenland", aliases: ["GL"]},
   {name: "Grenada", aliases: ["GD"]},
   {name: "Guadeloupe", aliases: ["GP"]},
   {name: "Guam", aliases: ["GU"]},
   {name: "Guatemala", aliases: ["GT"]},
   {name: "Guernsey", aliases: ["GG"]},
   {name: "Guinea", aliases: ["GN"]},
   {name: "Guinea-Bissau", aliases: ["GW"]},
   {name: "Guyana", aliases: ["GY"]},
   {name: "Haiti", aliases: ["HT"]},
   {name: "Heard Island and McDonald Islands", aliases: ["HM"]},
   {name: "Holy See (Vatican City State)", aliases: ["VA"]},
   {name: "Honduras", aliases: ["HN"]},
   {name: "Hong Kong", aliases: ["HK"]},
   {name: "Hungary", aliases: ["HU"]},
   {name: "Iceland", aliases: ["IS"]},
   {name: "India", aliases: ["IN"]},
   {name: "Indonesia", aliases: ["ID"]},
   {name: "Iran, Islamic Republic of", aliases: ["IR"]},
   {name: "Iraq", aliases: ["IQ"]},
   {name: "Ireland", aliases: ["IE"]},
   {name: "Isle of Man", aliases: ["IM"]},
   {name: "Israel", aliases: ["IL"]},
   {name: "Italy", aliases: ["IT"]},
   {name: "Jamaica", aliases: ["JM"]},
   {name: "Japan", aliases: ["JP"]},
   {name: "Jersey", aliases: ["JE"]},
   {name: "Jordan", aliases: ["JO"]},
   {name: "Kazakhstan", aliases: ["KZ"]},
   {name: "Kenya", aliases: ["KE"]},
   {name: "Kiribati", aliases: ["KI"]},
   {name: "Korea, Democratic People's Republic of", aliases: ["KP"]},
   {name: "Korea, Republic of", aliases: ["KR"]},
   {name: "Kuwait", aliases: ["KW"]},
   {name: "Kyrgyzstan", aliases: ["KG"]},
   {name: "Lao People's Democratic Republic", aliases: ["LA"]},
   {name: "Latvia", aliases: ["LV"]},
   {name: "Lebanon", aliases: ["LB"]},
   {name: "Lesotho", aliases: ["LS"]},
   {name: "Liberia", aliases: ["LR"]},
   {name: "Libya", aliases: ["LY"]},
   {name: "Liechtenstein", aliases: ["LI"]},
   {name: "Lithuania", aliases: ["LT"]},
   {name: "Luxembourg", aliases: ["LU"]},
   {name: "Macao", aliases: ["MO"]},
   {name: "Macedonia, the former Yugoslav Republic of", aliases: ["MK"]},
   {name: "Madagascar", aliases: ["MG"]},
   {name: "Malawi", aliases: ["MW"]},
   {name: "Malaysia", aliases: ["MY"]},
   {name: "Maldives", aliases: ["MV"]},
   {name: "Mali", aliases: ["ML"]},
   {name: "Malta", aliases: ["MT"]},
   {name: "Marshall Islands", aliases: ["MH"]},
   {name: "Martinique", aliases: ["MQ"]},
   {name: "Mauritania", aliases: ["MR"]},
   {name: "Mauritius", aliases: ["MU"]},
   {name: "Mayotte", aliases: ["YT"]},
   {name: "Mexico", aliases: ["MX"]},
   {name: "Micronesia, Federated States of", aliases: ["FM"]},
   {name: "Moldova, Republic of", aliases: ["MD"]},
   {name: "Monaco", aliases: ["MC"]},
   {name: "Mongolia", aliases: ["MN"]},
   {name: "Montenegro", aliases: ["ME"]},
   {name: "Montserrat", aliases: ["MS"]},
   {name: "Morocco", aliases: ["MA"]},
   {name: "Mozambique", aliases: ["MZ"]},
   {name: "Myanmar", aliases: ["MM"]},
   {name: "Namibia", aliases: ["NA"]},
   {name: "Nauru", aliases: ["NR"]},
   {name: "Nepal", aliases: ["NP"]},
   {name: "Netherlands", aliases: ["NL"]},
   {name: "New Caledonia", aliases: ["NC"]},
   {name: "New Zealand", aliases: ["NZ"]},
   {name: "Nicaragua", aliases: ["NI"]},
   {name: "Niger", aliases: ["NE"]},
   {name: "Nigeria", aliases: ["NG"]},
   {name: "Niue", aliases: ["NU"]},
   {name: "Norfolk Island", aliases: ["NF"]},
   {name: "Northern Mariana Islands", aliases: ["MP"]},
   {name: "Norway", aliases: ["NO"]},
   {name: "Oman", aliases: ["OM"]},
   {name: "Pakistan", aliases: ["PK"]},
   {name: "Palau", aliases: ["PW"]},
   {name: "Palestinian Territory, Occupied", aliases: ["PS"]},
   {name: "Panama", aliases: ["PA"]},
   {name: "Papua New Guinea", aliases: ["PG"]},
   {name: "Paraguay", aliases: ["PY"]},
   {name: "Peru", aliases: ["PE"]},
   {name: "Philippines", aliases: ["PH"]},
   {name: "Pitcairn", aliases: ["PN"]},
   {name: "Poland", aliases: ["PL"]},
   {name: "Portugal", aliases: ["PT"]},
   {name: "Puerto Rico", aliases: ["PR"]},
   {name: "Qatar", aliases: ["QA"]},
   {name: "Réunion", aliases: ["RE"]},
   {name: "Romania", aliases: ["RO"]},
   {name: "Russian Federation", aliases: ["RU"]},
   {name: "Rwanda", aliases: ["RW"]},
   {name: "Saint Barthélemy", aliases: ["BL"]},
   {name: "Saint Helena, Ascension and Tristan da Cunha", aliases: ["SH"]},
   {name: "Saint Kitts and Nevis", aliases: ["KN"]},
   {name: "Saint Lucia", aliases: ["LC"]},
   {name: "Saint Martin (French part)", aliases: ["MF"]},
   {name: "Saint Pierre and Miquelon", aliases: ["PM"]},
   {name: "Saint Vincent and the Grenadines", aliases: ["VC"]},
   {name: "Samoa", aliases: ["WS"]},
   {name: "San Marino", aliases: ["SM"]},
   {name: "Sao Tome and Principe", aliases: ["ST"]},
   {name: "Saudi Arabia", aliases: ["SA"]},
   {name: "Senegal", aliases: ["SN"]},
   {name: "Serbia", aliases: ["RS"]},
   {name: "Seychelles", aliases: ["SC"]},
   {name: "Sierra Leone", aliases: ["SL"]},
   {name: "Singapore", aliases: ["SG"]},
   {name: "Sint Maarten (Dutch part)", aliases: ["SX"]},
   {name: "Slovakia", aliases: ["SK"]},
   {name: "Slovenia", aliases: ["SI"]},
   {name: "Solomon Islands", aliases: ["SB"]},
   {name: "Somalia", aliases: ["SO"]},
   {name: "South Africa", aliases: ["ZA"]},
   {name: "South Georgia and the South Sandwich Islands", aliases: ["GS"]},
   {name: "South Sudan", aliases: ["SS"]},
   {name: "Spain", aliases: ["ES"]},
   {name: "Sri Lanka", aliases: ["LK"]},
   {name: "Sudan", aliases: ["SD"]},
   {name: "Suriname", aliases: ["SR"]},
   {name: "Svalbard and Jan Mayen", aliases: ["SJ"]},
   {name: "Swaziland", aliases: ["SZ"]},
   {name: "Sweden", aliases: ["SE"]},
   {name: "Switzerland", aliases: ["CH"]},
   {name: "Syrian Arab Republic", aliases: ["SY"]},
   {name: "Taiwan, Province of China", aliases: ["TW"]},
   {name: "Tajikistan", aliases: ["TJ"]},
   {name: "Tanzania, United Republic of", aliases: ["TZ"]},
   {name: "Thailand", aliases: ["TH"]},
   {name: "Timor-Leste", aliases: ["TL"]},
   {name: "Togo", aliases: ["TG"]},
   {name: "Tokelau", aliases: ["TK"]},
   {name: "Tonga", aliases: ["TO"]},
   {name: "Trinidad and Tobago", aliases: ["TT"]},
   {name: "Tunisia", aliases: ["TN"]},
   {name: "Turkey", aliases: ["TR"]},
   {name: "Turkmenistan", aliases: ["TM"]},
   {name: "Turks and Caicos Islands", aliases: ["TC"]},
   {name: "Tuvalu", aliases: ["TV"]},
   {name: "Uganda", aliases: ["UG"]},
   {name: "Ukraine", aliases: ["UA"]},
   {name: "United Arab Emirates", aliases: ["AE"]},
   {name: "United Kingdom", aliases: ["GB"]},
   {name: "United States", aliases: ["US", "USA", "United States of America"]},
   {name: "United States Minor Outlying Islands", aliases: ["UM"]},
   {name: "Uruguay", aliases: ["UY"]},
   {name: "Uzbekistan", aliases: ["UZ"]},
   {name: "Vanuatu", aliases: ["VU"]},
   {name: "Venezuela, Bolivarian Republic of", aliases: ["VE"]},
   {name: "Viet Nam", aliases: ["VN"]},
   {name: "Virgin Islands, British", aliases: ["VG"]},
   {name: "Virgin Islands, U.S.", aliases: ["VI"]},
   {name: "Wallis and Futuna", aliases: ["WF"]},
   {name: "Western Sahara", aliases: ["EH"]},
   {name: "Yemen", aliases: ["YE"]},
   {name: "Zambia", aliases: ["ZM"]},
   {name: "Zimbabwe", aliases: ["ZW"]}
]);



/*
# Canadian post addresses
#
# See eg Addressing Guidelines
# <http://www.canadapost.ca/tools/pg/manual/PGaddress-e.asp>
*/


(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define('cs!src/canada',['underscore', 'xregexp'], function() {
    var CANADA_MUNI_REX, CANADA_STREET_REX, COUNTRIES_REX, XRe, parse_address, provinces_list;
    XRe = require('xregexp');
    provinces_list = ["AB", "Alberta", "BC", "British Columbia", "Manitoba", "MB", "New Brunswick", "NB", "Newfoundland and Labrador", "Newfoundland", "NF", "NL", "Northwest Territories", "NT", "Nova Scotia", "NS", "Nunavut", "NU", "ON", "Ontario", "Prince Edward Island", "PE", "Quebec", "QC", "Saskatchewan", "SK", "Yukon", "YT"];
    COUNTRIES_REX = XRe("(" + (_.keys(require('content/iso3166')).join("|")) + ")");
    CANADA_MUNI_REX = XRe("^\s*    (?<muni> \\w[\\w\\s\.]+?) \\s* ,? \\s*    (?<prov> " + (provinces_list.join("|")) + ") \\s* ,? \\s*    (?<postal> \\w\\d\\w\\s*\\d\\w\\d) \s*    $", 'x');
    CANADA_STREET_REX = XRe("^\\s*    (?:(?<suite> [^-]+) \\s* - \\s*)?    (?<number> \\d+)? \\s+    (?<name> .*?) \\s*    $", 'x');
    /*
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
    */

    parse_address = function(addr) {
      var fields, last_line, lines, m;
      lines = _.filter(_.map(addr.splitlines(), $.trim));
      fields = {};
      if (lines.length < 2) {
        throw new Error("Addresses must be at least two lines.");
      }
      last_line = lines.pop();
      if (m = XRe.exec($.trim(last_line), COUNTRIES_REX)) {
        fields['country'] = m[1];
        if (lines.length < 2) {
          throw new Error("Using country " + m[1] + "; country-specific address                         must be 2 lines");
        }
        last_line = lines.pop();
      } else if (m = XRe.exec(last_line, CANADA_MUNI_REX)) {
        fields['municipality'] = m.muni;
        fields['province'] = m.prov;
        fields['postal'] = m.postal;
        if (__indexOf.call(fields, 'country') < 0) {
          fields['country'] = 'Canada';
        }
      } else {
        throw new Error("The last line should be 'Municipality Prov Postal code'");
      }
      last_line = lines.pop();
      if (m = XRe.exec(last_line, CANADA_STREET_REX)) {
        fields['suite'] = m.suite;
        fields['street_number'] = m.number;
        fields['street_name'] = m.name;
      } else {
        fields['street_number_2'] = last_line;
        if (lines.length > 0) {
          last_line = lines.pop();
          if (m = XRe.exec(last_line, CANADA_STREET_REX)) {
            fields['suite'] = m.suite;
            fields['street_number'] = m.number;
            fields['street_name'] = m.name;
          } else {
            throw new Error("Line " + (lines.length + 1) + " was expected to be street 'Suite - Street # Street name', but it is \"" + last_line + "\"");
          }
        } else {
          throw new Error("An address requires a street e.g. 'Suite - Street # Street name'");
        }
      }
      fields['addressee'] = lines.pop();
      if (lines.length > 0) {
        throw new Error("This address has too many opening lines.");
      }
      return fields;
    };
    return {
      parse: parse_address
    };
  });

}).call(this);


/*
# Main
#
# Returns the jAddressParser object
*/


(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define('cs!src/main',['underscore', './iso3166', 'cs!./canada'], function() {
    var ALL_COUNTRY_IDS, COUNTRY_NAMES_MAP, country_parser_map, iso3166, jAddressParser;
    iso3166 = require('iso3166');
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
    country_parser_map = {
      'canada': 'cs!./canada'
    };
    jAddressParser = (function() {

      function _Class(defaultCountry) {
        this._string = s;
        this._defaultCountry = defaultCountry;
      }

      _Class.prototype.parse = function(str, defaultCountry) {
        var canonical_name, country, country_parser_required, last_line, lines;
        if (!_.isString(str)) {
          throw new Error("Address must be a string");
        }
        lines = _.filter(_.map(str.split('\n'), function(s) {
          return e.trim();
        }));
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
        country_parser_required = country_parser_map[canonical_name];
        try {
          require(country_parser_required).parse(lines);
        } catch (err) {
          console.log("Invalid address: " + err);
          throw new Error("Invalid address: " + err);
        }
        return parsed;
      };

      return _Class;

    })();
    return jAddressParser;
  });

}).call(this);
}());