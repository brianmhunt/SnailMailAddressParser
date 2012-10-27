({
  baseUrl: ".",
  stubModules: ['cs', 'coffee-script'],
  wrap: {
    // we use the typeof define here because we run our tests on the compiled
    // .js file (since loading CoffeeScript in the testloader proved to be too
    // broken). Note the 'function !== typeof define' - we want to avoid r.js
    // stripping out this line. Which it does.
    // see eg https://github.com/jrburke/amdefine
      start: "(function() { if ('function' !== typeof define) { var define = require('amdefine')(module); }",
      end: "}());"
  },
  paths: {
    amdefine: 'empty:',
    cs: 'lib/require-cs',
    'coffee-script': 'lib/coffee-script',
    underscore: 'empty:',
    xregexp: 'empty:'
  },
  name: "cs!src/main",
  out: "build/jAddressParser.js",
  optimize: 'none'
})
