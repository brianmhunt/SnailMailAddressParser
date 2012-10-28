#
# Test the basic functionality
#
_ = require('lodash'); chai = require('chai')
{log, error} = require('util'); fs = require('fs'); path = require('path')
yaml = require('js-yaml')
assert = chai.assert; expect = chai.expect; should = chai.should()
color = require('mocha').reporters.Base.color
smap = require("../build/snailmailaddressparser")


# Ensure the type of import is what we expect
describe "SnailMailAddressParser", ->
  it("should be an object with a parse function", ->
    expect(smap).to.be.a('object')
    expect(smap).to.have.property('parse')
    expect(smap.parse).to.be.a('function')
  )

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

      it "has #{color("pending", key)} of \"#{value}\"", ->
        if not _.has(parsed, key)
          assert.fail("the parsed result does not have #{key}")
          return
        
        assert.equal(parsed[key], value)
        # "#{color("pending", key)} is #{parsed[key]}")

    it "the parsed result has no extra keys", ->
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
        parsed = smap.parse(addr.given, country)
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
  fs.readFile test_file, "utf8", (err, data) ->
    if (err)
      error "Exception reading the file #{test_file}"
      return

    yaml.loadAll data, (test_set) ->
      address_tester(test_set)

console.log "Completed tests."
