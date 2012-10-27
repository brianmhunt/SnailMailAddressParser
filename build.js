({
  baseUrl: ".",
  stubModules: ['cs', 'coffee-script'],
  paths: {
    canada: "cs!src/canada",
    iso3166: "src/iso3166",
// external
    cs: 'lib/require-cs',
    'coffee-script': 'lib/coffee-script',
    underscore: 'empty:',
    xregexp: 'empty:'
  },
  name: "cs!src/main",
  out: "build/jAddressParser.js",
  optimize: 'none'
})
