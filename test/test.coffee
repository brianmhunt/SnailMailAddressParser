#
# Test the basic functionality
#
requirejs = require('requirejs')
chai = require('chai')

assert = chai.assert
expect = chai.expect
should = chai.should()

requirejs.config
  nodeRequire: require
  baseUrl: __dirname

console.log("MODULE", module)

jAddressParser = requirejs("../build/jAddressParser")

describe "jAddressParser", ->
  it("should be an object with a parse function", ->
    expect(jAddressParser).to.be.a('object')
    expect(jAddressParser).to.have.property('parse')
    expect(jAddressParser.parse).to.be.a('function')
  )


