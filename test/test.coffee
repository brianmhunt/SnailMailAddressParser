#
# Test the basic functionality
#
# --- Included at the top of each test file
_ = require('lodash'); chai = require('chai')
assert = chai.assert; expect = chai.expect; should = chai.should()
smap = require("../build/SnailMailAddressParser")
# ---

describe "SnailMailAddressParser", ->
  it("should be an object with a parse function", ->
    expect(smap).to.be.a('object')
    expect(smap).to.have.property('parse')
    expect(smap.parse).to.be.a('function')
  )


