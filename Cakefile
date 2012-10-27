#
# Cakefile
# --------
#
#  Targets:
#
#     deps:
#     	install npm dependencies
#
#     tests:
#     	run mocha tests in node.js
#
# See sample cakefile at
# https://github.com/kompiro/Cakefile-Sample/

{spawn} = require 'child_process'
fs = require 'fs'
path = require 'path'
{log, error} = require 'util'

TEST_COMMAND="#{__dirname}/node_modules/.bin/mocha"
TEST_OPTIONS='--growl --compilers coffee:coffee-script -R spec'
PROGNAM='jAddressParser'

DEPS = ['lodash', 'requirejs', 'coffee-script', 'xregexp', 'chai', 'mocha',
  'amdefine']

task 'test', 'Run tests in Mocha', (options) ->
  log "start test"
  args = "#{TEST_OPTIONS}".trimRight().split(' ')
  spawn "#{TEST_COMMAND}",args,customFds : [0, 1, 2]

task 'deps', 'Install dependant npm modules', (options) ->
  args = "install #{DEPS.join(" ")}".trimRight().split(" ")
  log "npm #{args.join(" ")}"
  spawn "npm",args,customFds : [0, 1, 2]

task 'build', "Build #{PROGNAM} to the build/ directory", (options) ->
  log "Building with r.js"
  args = ["-o", "build.js"]
  spawn "r.js",args,customFds : [0, 1, 2]

