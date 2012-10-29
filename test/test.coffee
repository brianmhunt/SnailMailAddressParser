#
# Test the basic functionality
#
_ = require('underscore'); chai = require('chai')
{log, error} = require('util'); fs = require('fs'); path = require('path')
yaml = require('js-yaml')
assert = chai.assert; expect = chai.expect; should = chai.should()
color = require('mocha').reporters.Base.color
smap = require("../build/snailmailaddressparser")

# Ensure the type of import is what we expect
describe "SnailMailAddressParser", ->
  it "should be an object with a parse function", ->
    expect(smap).to.be.a('object')
    expect(smap).to.have.property('parse')
    expect(smap.parse).to.be.a('function')

  it "should have a semver compatible version (#{smap.Version})", ->
    assert require('semver').valid(smap.Version)



#
#   Strategy Unit Tests
#   -------------------
#
strategies = smap.AddressStrategy.all_strategies()

describe "Address strategies ", ->

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
      )
      # a list of unique line matchers for this strategy
      line_matchers = {}
      _.each(strats, (strat) ->
        _.each strat, (lm) -> line_matchers[lm.name] = lm
      )

      #
      # Test the line matchers against their internal matches
      #
      _.each(line_matchers, (lm, name) ->
        valid_tests = lm.options.valid_tests
        invalid_tests = lm.options.invalid_tests
        describe "line matcher #{lm.name}", ->
          it "has an array of valid tests", ->
            assert _.isArray(valid_tests)
            assert valid_tests.length > 0

          _.each(valid_tests, (test) ->
            describe "valid data \"#{test}\"", ->
              it "matches", ->
                assert lm.match(test)
          )

          it "has an array of invalid tests", ->
            assert _.isArray(invalid_tests)
            assert invalid_tests.length > 0

          _.each(invalid_tests, (test) ->
            describe "invalid data \"#{test}\"", ->
              it "should not match", ->
                assert not lm.match(test)
          )
      )
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
    it "becomes an object", ->
      assert.isObject(parsed)

    _.each expected, (value, key) ->
      value = value or ''

      it "has #{color("pending", key)} of \"#{value}\"", () ->
        if not _.has(parsed, key)
          assert.fail("the parsed result does not have #{key}")
          return
        
        assert.equal(parsed[key], value)

    it "has no extra keys", () ->
      parsed_only_keys = _.difference(_.keys(parsed), _.keys(expected))
      assert(_.isEmpty(parsed_only_keys),
        "Parsed result contains \"#{parsed_only_keys}\" keys, "+
        "but 'twas not expected.")

  return # _parsed_object_test

address_tester = (test_set) ->
  describe test_set.name, ->
    country = test_set.country or undefined
    test_set.addresses.forEach (addr) ->
      given_str = color("pending", JSON.stringify(addr.given)) # escape newlines

      describe given_str, ->
        try
          parsed = smap.parse(addr.given, country)
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

