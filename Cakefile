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
fs = require 'fs'
glob = require 'glob'
_ = require 'underscore'
coffee = require 'coffee-script'

MOCHA_CMD = './node_modules/mocha/bin/mocha'
UGLIFY_CMD = './node_modules/uglify-js2/bin/uglifyjs2'

SRC_DIR='lib'

# these are manually ordered dependencies
COFFEE_SRC = [
  'iso3166.coffee',
  'LineMatcher.coffee',
  'AddressStrategy.coffee',
  '*',
]

DEST='build/snailmailaddressparser'

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
  var XRegExp = xregexp.XRegExp, VERSION;
  XRegExp.addUnicodePackage();
/*  ---- Begin AMD content ---- */
"""
FOOTER = """
/*  ---- End AMD content ---- */
  return new SnailMailAddressParser();
});
"""

task 'test', 'Run tests in Mocha (via "npm test")', (options) ->
  args = ["--compilers", "coffee:coffee-script", "-R", "spec"]
  log "Cake is running: #{MOCHA_CMD} #{args.join(" ")}"
  spawn MOCHA_CMD, args, customFds: [0, 1, 2]

task 'toast', "Build the project into the build/ dir", (options) ->
  # although I stopped using coffee-toaster (because it wouldn't track
  # dependencies), its builder.coffee was a helpful guide to how to perform the
  # following. An alternative to the following would be figuring out Grunt.
  source_dir = require('path').join(__dirname, SRC_DIR)

  version = JSON.parse(fs.readFileSync("package.json")).version

  console.log "Compiling version #{version}"

  sources = []

  # Get all source files. Preserve the order in COFFEE_SRC
  _.each(COFFEE_SRC, (src) ->
    _.each(glob.sync(src, cwd: source_dir), (filename) ->
      if filename not in sources
        sources.push(filename)
    )
  )

  # get the source as a string
  source = _.map(sources, (src_file) ->
    src_file = require('path').join(SRC_DIR, src_file)
    console.log "Compiling #{src_file}."
    js = coffee.compile fs.readFileSync(src_file, 'utf8'), {bare: true}
    return "\n// -- from: #{src_file} -- \\\\\n" + js
  ).join("\n")

  contents = LEADER + "\nVERSION = \"#{version}\";" + source + FOOTER

  console.log "Writing #{DEST}.js"
  fs.writeFileSync("#{DEST}.js", contents, 'utf8')

  # minify the content
  console.log "Creating minified #{DEST}.min.js"
  args = ["#{DEST}.js", '-o', "#{DEST}.min.js", '-m', '--lint']
  spawn UGLIFY_CMD, args, customFds: [0, 1, 2]




