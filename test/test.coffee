#
# Test the basic functionality
#
_ = require('lodash'); chai = require('chai')
{log, error, inspect} = require('util'); fs = require('fs')
path = require('path'); yaml = require('js-yaml')
assert = chai.assert; expect = chai.expect; should = chai.should()
color = require('mocha').reporters.Base.color
smap = require("../build/snailmailaddressparser").simplemailaddressparser

strategies = []

# Ensure the type of import is what we expect
describe "SnailMailAddressParser", ->
  it "should be an object with a parse function", ->
    expect(smap).to.be.a('object')
    expect(smap).to.have.property('parse')
    expect(smap.parse).to.be.a('function')

  it "should have a semver compatible version (#{smap.Version})", ->
    assert require('semver').valid(smap.Version)

describe "LineMatcherStrategy", ->
  it "should have line matcher and strategy", ->
    LM = smap.LineMatcher
    LMS = smap.LineMatcherStrategy

    assert.isFunction(LM)
    assert.isFunction(LMS)

  it "should combine all permutations", ->
    LM = smap.LineMatcher
    LMS = smap.LineMatcherStrategy

    lm1 = new LM("LM 1", "1")
    lm2 = new LM("LM 2", "2")
    lm3 = new LM("LM 3", "3", is_optional: true)
    lm4 = new LM("LM 4", "4").optional()

    lms = new LMS()
    lms.add(lm1, lm2, lm3, lm4)

    assert _.isEqual(lms.all(), [
      [lm1, lm2, lm3, lm4],
      [lm1, lm2,      lm4],
      [lm1, lm2, lm3     ],
      [lm1, lm2          ],
    ])

#
#   Strategy Unit Tests
#   -------------------
#
strategies = smap.AddressStrategy.all_strategies()

describe "Address strategies", ->
  it "should have a Canada strategy", ->
    assert.ok(strategies.canada, "strategies.canada does not exist")
    line_strats = strategies.canada.line_strategies().length
    assert.ok(line_strats > 4,
      "Canada should have at least 4 line strategies, got #{line_strats}")

  ###
  # Test the strategy for constituents of the correct type
  ###
  _.each(strategies, (strategy_instance) ->
    describe "for #{strategy_instance.name}", ->
      ls_foo = strategy_instance.line_strategies

      # not all country strategies will have a line strategy; however, at the
      # moment they do
      it "has a line_strategies function", ->
        assert _.isFunction(ls_foo)

      strats = ls_foo()

      it "has an array of strategies", ->
        assert _.isArray(strats)

      _.each(strats, (strat, index) ->
        describe "Strategy ##{index}", ->
          it "is an array of ListMatcher instances", ->
            assert _.all(strat, (lm) ->
              # while we are here, add the class to line_matchers
              return lm.isLineMatcherClass
            )
        return
      )

      # a list of unique line matchers for this strategy
      line_matchers = {}

      add_line_matcher = (lm) ->
        line_matchers[lm.name] = lm
        if lm.options._or
          add_line_matcher(lm.options._or)

      _.each(strats, (strat) ->
        _.each strat, (lm) -> add_line_matcher(lm); return
        return
      )

      #
      # Test the line matchers against their internal matches
      #
      _.each(line_matchers, (lm, name) ->
        valid_tests = lm.options.valid_tests
        invalid_tests = lm.options.invalid_tests
        describe "line matcher #{color "green", lm.name}", ->
          it "has an object mapping valid tests to expected results", ->
            assert _.isObject(valid_tests)
            assert not _.isArray(valid_tests), "valid_tests is an array"
            assert _.keys(valid_tests).length > 0

          _.each(valid_tests, (expected, test) ->
            describe "valid data \"#{color "pending", test}\"", ->
              matches = lm.match(test, false)
              it "matches #{inspect matches}", ->
                if not matches
                  console.log "expr: |#{lm.rex}| is null"
                  assert false, "#{inspect matches} != #{inspect expected}"
                if not _.isEqual(matches, expected)
                  console.log "expr: |#{lm.rex}| !=> #{inspect matches}"
                  assert false, "#{inspect matches} != #{inspect expected}"
          )

          it "has an array of invalid tests", ->
            assert _.isArray(invalid_tests)
            assert invalid_tests.length > 0

          _.each(invalid_tests, (test) ->
            describe "invalid data \"#{test}\"", ->
              it "should not match", ->
                match = lm.match(test, false)
                if match
                  console.log "expr: |#{lm.rex}| matches: #{inspect match}"
                  assert false
          )
          return
      )
    return
  ) # /each strategy


#
#   YAML TESTS
#   ----------
#
# Testing with .YAML files - map address strings to expected returns
# Read every .YAML file in the ./test directory
# Note that each .YAML can be divided into multiple test sets (with "---")
#
# Run each test set through the address_tester function
_parsed_object_test = (parsed, expected) ->
  expect_str = color("pending", JSON.stringify(expected, null, 2))
  parsed_str = color("error message", JSON.stringify(parsed, null, 2))

  describe "when parsed by SnailMailAddressParser", ->
    it "becomes an object with a 'matches' property", ->
      assert.isObject(parsed)
      assert _.has(parsed, 'matches')

    matches = parsed.matches
    is_equal = true
    
    if _.isObject expected
      it "has only one match", ->
        assert parsed.matches.length == 1
    else if _.isArray expected
      # TODO List of matches
      log("***WARNING***: " +
      "Tests for multiple expected results is not yet implemented")
    else
      log "Expected was not a valid type (object or array)."

    match = parsed.matches[0]

    _.each expected, (value, key) ->
      value = value or ''

      it "has #{color("pending", key)} of \"#{value}\"", () ->
        if not _.has(match, key)
          assert.fail("the parsed matches do not have #{key}")
          return

        if match[key].toString() != value.toString()
          console.log "parsed result is actually \"#{match[key]}\"."
          is_equal = false

        assert.equal(match[key], value)

    it "has no extra keys", () ->
      parsed_only_keys = _.difference(_.keys(match), _.keys(expected))
      assert(_.isEmpty(parsed_only_keys),
        "Parsed matches contains \"#{parsed_only_keys}\" keys, "+
        "but 'twas not expected.")
  
    # console.log "Actual match #{inspect match}"

  return # _parsed_object_test

address_tester = (test_set) ->
  describe test_set.name, ->
    country = test_set.country or undefined
    test_set.addresses.forEach (addr) ->
      given_str = color("pending", JSON.stringify(addr.given)) # escape newlines

      describe given_str, ->
        try
          parsed = smap.parse(addr.given, defaultCountry: country)
        catch err
          assert false, "\nWhile parsing address: " +
            "\n#{color("pending", addr.given)}" +
            "encountered #{color("error message", err)}."
          return
        _parsed_object_test(parsed, addr.expect)
  return # address_tester

# Recurse down into sub-directories of ./test/
#
test_files = []
# __dirname is SnailMailAddressParser/test
fs.readdirSync(__dirname).forEach((pathname) ->
  pathname = path.join(__dirname, pathname)
  if fs.statSync(pathname).isDirectory()
    run_test_yaml_files(pathname)
  else if pathname.match(/\.yaml$/)
    test_files.push(pathname)
)

test_set = []
# convert each file into a test set item
test_files.forEach (test_file) ->
  data = fs.readFileSync test_file, "utf8"

  yaml.loadAll data, (test_set) ->
    address_tester(test_set)

log "Tests loaded."

