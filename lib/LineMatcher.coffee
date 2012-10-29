#
#   LineMatcher
#   -----------
#
# A LineMatcher test corresponds to a single line of a bigger address parsing
# strategy. An address parsing strategy will usually be made up of more than
# one line strategies in an array. If every LineMatcher matches every line of
# an address, then the address matches. If not, the LineMatcher name can
# give us some idea of where the match went wrong.
#
# Line matcher has built-in unit tests, by way of valid_tests and invalid_tests
# so that we can localize the regular expression and some examples that it will
# be tested against.
#
class LineMatcher
  constructor: (@name, @expression, options={}) ->
    @options = _.defaults(options,
      rex_flags: 'xi'
      valid_tests: []
      invalid_tests: []
    )

    @rex = XRegExp("^#{expression}$", @options.rex_flags)

  # match
  # ~~~~~
  # Return an object mapping matched items if the line matches, null otherwise
  #
  match: (line) ->
    matches = XRegExp.exec(line, @rex)

    if matches == null
      return null

    # console.log("Match of \"#{line}\" against #{@name}: \"#{@expression}\"")
  
    # Filter out numeric indexes and XRegExp hard-coded 'index' and 'input'
    # properties
    EXCLUDED = ['index', 'input'] # ignore these properties
    matched_properties = {}

    # matches.keys is [0,1,2,input,index, <our properties>]; the
    # 0,1,2,index,input are all added by XRegExp. We want the named properties
    # returned.
    _.each(_.keys(matches), (key) ->
      if key not in EXCLUDED and isNaN(key)
        matched_properties[key] = matches[key]
    )

    # matches is now e.g. { addressee: 'John' }
    return matched_properties

  # the following tells the tester that this is a linematcher class
  # the alternative is eg
  #   lminstance.__proto__.constructor.name == "LineMatcher"
  # which prevents subclassing
  isLineMatcherClass: true

