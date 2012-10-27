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
SRC_DIR='src/'

BUNDLE = [
  'iso3166.js',
  #'base.coffee',
  'canada.coffee',
  'main.coffee',
]

TARGET='build/jAddressParser.js'

DEPS = ['lodash', 'requirejs', 'coffee-script', 'xregexp', 'chai', 'mocha',
  'amdefine', 'flour']

task 'test', 'Run tests in Mocha', (options) ->
  log "test with #{TEST_COMMAND}"
  args = "#{TEST_OPTIONS}".trimRight().split(' ')
  spawn "#{TEST_COMMAND}",args,customFds : [0, 1, 2]

task 'deps', 'Install dependant npm modules', (options) ->
  args = "install #{DEPS.join(" ")}".trimRight().split(" ")
  log "npm #{args.join(" ")}"
  spawn "npm",args,customFds : [0, 1, 2]

task 'bake', "Build the project into the build/ dir", (options) ->
  log "BAKING IS BROKEN. BOO!"
  flour = require 'flour'
  log "baking (#{JSON.stringify(options)})"
  jsm = flour.minifiers['.js']

  if '--minify' not in options['arguments']
    log "Not minifying. Use --minify to minify the output"
    flour.minifiers['.js'] = "abc" # (file, cb) -> cb file.buffer

  bundle BUNDLE.map((f) -> SRC_DIR+f), TARGET

task 'toast', "Build the project into the build/ dir", (options) ->
  log "toasting"
  Toaster = require("coffee-toaster").Toaster

  toast_options =
    #config: 'toaster.coffee'
    c: true
    config:
      minify: false
      
    
  if '--minify' not in options['arguments']
    log "Not minifying. Use --minify to minify the output"
    toast_options.config['minify'] = false

  toasting = new Toaster __dirname, toast_options
  toasting.build
  

  

#task 'build', "Build #{PROGNAM} to the build/ directory", (options) ->
  #log "build with r.js"
  #  args = ["-o", "build.js"]
  #  spawn "r.js",args,customFds : [0, 1, 2]

