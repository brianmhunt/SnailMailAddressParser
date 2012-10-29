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
# Based on sample cakefile at
# https://github.com/kompiro/Cakefile-Sample/

{spawn} = require 'child_process'
{log} = require 'util'

TARGET='build/snailmailaddressparser'

# The following uses `amdefine` for AMD support on Node.js
# It should also work with RequireJS.
# In future it should "just work" in other sensible cases.
#
# TODO: check for global "_" (underscore)
LEADER = """
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
  var XRegExp = xregexp.XRegExp;
/*  ---- Begin AMD content ---- */
"""
FOOTER = """
/*  ---- End AMD content ---- */
  return new SnailMailAddressParser();
});
"""

task 'test', 'Run tests in Mocha (via "npm test")', (options) ->
  log "Cake is running: npm test"
  args = ["--compilers", "coffee:coffee-script", "-R", "spec"]
  spawn "mocha", args, customFds: [0, 1, 2]

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
    
  log "Cake is toasting: #{toast_options.config.release}"
  toasting = new Toaster __dirname, toast_options
  toasting.build LEADER, FOOTER

  # build minified (.min.js)
  toast_options.config.minify = true
  toast_options.config.release = TARGET + ".min.js"

  log "Cake is toasting: #{toast_options.config.release}"
  toasting = new Toaster __dirname, toast_options
  toasting.build LEADER, FOOTER

