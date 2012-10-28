#
# Cakefile
# --------
#
#  Targets:
#
#     deps:
#     	install npm dependencies
#
#     toast:
#       create the javascript files in the build/ directory
#
#     tests:
#     	run mocha tests in node.js
#
#
# See sample cakefile at
# https://github.com/kompiro/Cakefile-Sample/

{spawn} = require 'child_process'
fs = require 'fs'
path = require 'path'
{log, error} = require 'util'

TARGET='build/SnailMailAddressParser'

DEPS = ['lodash', 'requirejs', 'coffee-script', 'xregexp', 'chai', 'mocha',
  'amdefine', 'flour']

# The following uses `amdefine` for AMD support on Node.js
# It should also work with RequireJS.
# In future it should "just work" in other sensible cases.
LEADER = """
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['lodash', 'XRegExp'], function (_, xregexp) { // begin AMD definition
  var XRegExp = xregexp.XRegExp;
"""
FOOTER = """
  return new AddressParser();
}); // end AMD definition
"""

task 'deps', 'Install dependant npm modules', (options) ->
  args = "install #{DEPS.join(" ")}".trimRight().split(" ")
  log "npm #{args.join(" ")}"
  spawn "npm",args,customFds : [0, 1, 2]

task 'test', 'Run tests in Mocha', (options) ->
  #TEST_COMMAND="#{__dirname}/node_modules/.bin/mocha"
  #TEST_OPTIONS='--growl --compilers coffee:coffee-script -R spec'
  #log "test with #{TEST_COMMAND}"
  #args = "#{TEST_OPTIONS}".trimRight().split(' ')
  #spawn "#{TEST_COMMAND}",args,customFds : [0, 1, 2]
  spawn "npm", ['test'], customFds: [0, 1, 2]

task 'toast', "Build the project into the build/ dir", (options) ->
  Toaster = require("coffee-toaster").Toaster

  toast_options =
    c: true
    d: false
    config:
      bare: true
      minify: false
      packaging: false
      folders:
        'lib/': 'SnailMailAddressParser'
      release: TARGET + ".js"
    
  # build unminified (.js)
  try
    log "toasting -> #{toast_options.config.release}"
    toasting = new Toaster __dirname, toast_options
    toasting.build LEADER, FOOTER

    # build minified (.min.js)
    toast_options.config.minify = true
    toast_options.config.release = TARGET + ".min.js"

    log "toasting -> #{toast_options.config.release}"
    toasting = new Toaster __dirname, toast_options
    toasting.build LEADER, FOOTER
  catch err
    log "Unable to compile: #{err}"

