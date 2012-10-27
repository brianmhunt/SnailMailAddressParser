#
# Test the basic functionality
#
_ = require('lodash')
chai = require('chai')

assert = chai.assert
expect = chai.expect
should = chai.should()

ap = require("../build/jAddressParser")

describe "jAddressParser", ->
  it("should be an object with a parse function", ->
    expect(ap).to.be.a('object')
    expect(ap).to.have.property('parse')
    expect(ap.parse).to.be.a('function')
  )


