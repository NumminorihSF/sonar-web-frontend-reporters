const reporterFactory = require('./reporters/reporter.factory.test'),
  esLintReporter = require('./reporters/eslint.reporter.test');

reporterFactory();
esLintReporter();
