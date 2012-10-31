###
#
# Some debugging utilities
#
####

if typeof module != 'undefined' and module.exports
  # node.js

  inspect = (o, showHidden=false, depth=2) ->
    require('util').inspect(o, showHidden, depth, true)

  log = (string) -> require('util').debug(string)
else
  # browser
  #
  inspect = (o) -> console.log o
  log = (o) -> console.log o
