#
#   LineMatcherStrategy
#   -------------------
#
#
#
#
#
#
#
class LineMatcherStrategy
  constructor: () ->
    @_list = []


  # line_matcher_list is a list of LineMatcher classes e.g.
  # [ADDRESSEE, STREET, MUNICIPALITY, POSTAL]
  #
  # Every permutation of optional elements is added e.g.  if Addressee and
  # Street are optional, add() will tack onto @_list the following:
  #
  # [ADDRESSEE, STREET, MUNICIPALITY, POSTAL]
  # [ADDRESSEE,         MUNICIPALITY, POSTAL]
  # [           STREET, MUNICIPALITY, POSTAL]
  # [                   MUNICIPALITY, POSTAL]
  # ^^^ permutations, below, will look like this
  #
  #
  add: (line_matcher_list...) ->
    # to_add is a list of line_matcher_list lists. It will contain every
    # permutation of the list combitation of optional elements

    permutations = [_.toArray(line_matcher_list)]
    # first permutation has every element

    # try every element of the given list to see if they are optional. If they
    # are make a copy of every permutation without that optional element.
    _.each(line_matcher_list, (lm, index) ->
      if not lm.is_optional()
        return

      # permutation without the given line matcher
      # we're cloning the permutations here
      perms_wo_lm = []

      _.each(permutations, (perm) ->
        matcher_set = _.clone(perm)
        matcher_set.splice(matcher_set.indexOf(lm), 1)
        perms_wo_lm.push(matcher_set)
      )

      # copy this permutation into the permutations list
      permutations = permutations.concat(perms_wo_lm)
    )

    @_list = @_list.concat(permutations)

  # return the list of permutations
  all: () -> return @_list

