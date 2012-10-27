#
# Test Canadian addresses
#
# --- Included at the top of each test file
_ = require('lodash'); chai = require('chai')
assert = chai.assert; expect = chai.expect; should = chai.should()
ap = require("../build/jAddressParser")
color = require('mocha').reporters.Base.color
# ---

# A list of expected results for the given addresses
expectations = {
  "100 Bay Street\nToronto, ON M5H 1T1" : {
    "municipality": "Toronto",
    "province": "ON",
    "postal": "M5H 1T1",
    "country": "Canada",
    "street_number": "100",
    "street_name": "Bay Street",
    'street_name_2': '',
    "addressee": "",
    'suite': ''
  },

  "Mr. Incognito\n100 Bay Street\nToronto, ON M5H 1T1" : {
    "municipality": "Toronto",
    "province": "ON",
    "postal": "M5H 1T1",
    "country": "Canada",
    "street_number": "100",
    "street_name": "Bay Street",
    "street_name_2": "",
    "addressee": "Mr. Incognito"
    'suite': ''
  },
}

describe "Unambiguous Canadian addresses", ->
  _.each expectations, (expect, from_string) ->
    from_addr = color("pending", JSON.stringify(from_string)) # escape newlines

    describe from_addr, ->
      expect_string = color("pending", JSON.stringify(expect, null, 2))

      it "is expected to be an object", ->
        assert.isObject(expect)

      describe "when parsed", ->
        parsed = ap.parse(from_string, 'Canada')
        parsed_string = color("error message", JSON.stringify(parsed, null, 2))

        it "parses into an object", ->
          assert.isObject(parsed)

        it "has the expected keys", ->
          parsed_only_keys = _.difference(_.keys(parsed), _.keys(expect))
          expect_only_keys = _.difference(_.keys(expect), _.keys(parsed))

          assert(_.isEmpty(parsed_only_keys),
            "Expected \"#{parsed_only_keys}\" attribute(s), "+
            "but 'twas not in the parsed result")
          assert(_.isEmpty(expect_only_keys),
            "Parsed result had \"#{parsed_only_keys}\" attribute(s), "+
            "but 'twas not expected")

        it "has identical values", ->
          # all the keys are identical
          assert(_.isEqual(expect, parsed),
            "Parsed result is not what was expected." +
            " Expected:\n#{expect_string}" +
            " Got \n#{parsed_string}")
          return

      return # describe address

    return # describe good address
  

