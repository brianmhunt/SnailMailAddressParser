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

TEST_COMMAND="#{__dirname}/node_modules/.bin/mocha"
TEST_OPTIONS='--growl --compilers coffee:coffee-script -R spec'

TARGET='build/jAddressParser'

DEPS = ['lodash', 'requirejs', 'coffee-script', 'xregexp', 'chai', 'mocha',
  'amdefine', 'flour']

# The following is an AMD wrapper
# from: https://gist.github.com/1251668
LEADER = """
(function(def) {
  def(['lodash', 'XRegExp'], function (_, XRegExp) { // begin AMD definition
"""

FOOTER = """
  }); // end AMD definition
}(
   typeof define === 'function' && define.amd?
    //AMD
    function(name, deps, factory){
        define(deps, factory);
    } :
    //CommonJS
    function(deps, factory){
        module.exports = factory.apply(this, deps.map(require));
    }
));
"""

task 'test', 'Run tests in Mocha', (options) ->
  log "test with #{TEST_COMMAND}"
  args = "#{TEST_OPTIONS}".trimRight().split(' ')
  spawn "#{TEST_COMMAND}",args,customFds : [0, 1, 2]

task 'deps', 'Install dependant npm modules', (options) ->
  args = "install #{DEPS.join(" ")}".trimRight().split(" ")
  log "npm #{args.join(" ")}"
  spawn "npm",args,customFds : [0, 1, 2]

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
        'src/': 'jAddressParser'
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

