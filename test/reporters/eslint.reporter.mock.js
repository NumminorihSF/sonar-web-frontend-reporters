module.exports = {

  defaultOptions: {
    src      : 'test/mocks/eslint.js',
    report   : 'test/output/eslint.json',
    rulesFile: 'test/mocks/.eslintrc',
    ignore   : false
  },

  multiSrcOption: {
    src      : [ 'test/mocks/eslint.js', '!test/mocks/eslint-ignore.js' ],
    report   : 'test/output/eslint.json',
    rulesFile: 'test/mocks/.eslintrc',
    ignore   : false
  },

  badSrcOption: {
    src      : 'test/mocks/unexisting-file.js',
    report   : 'test/output/eslint.json',
    rulesFile: 'test/mocks/.eslintrc',
    ignore   : false
  },

  badRulesFileOption: {
    src      : 'test/mocks/eslint.js',
    report   : 'test/output/eslint.json',
    rulesFile: 'test/mocks/bad.eslintrc',
    ignore   : false
  }

};
