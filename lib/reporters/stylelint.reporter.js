const stylelint = require('stylelint'),
  ReporterType = require('../reporter.enum'),
  Reporter = require('../reporter');

module.exports = class ESLintReporter extends Reporter {

  constructor (options, projectName) {
    super(options, projectName);

    this.linterName = 'StyleLint';
  }

  static defaultOptions () {
    return {
      src       : 'src/**/*.s?css',
      report    : 'reports/sonar/stylelint.json',
      rulesFile : '.stylelintrc',
      ignorePath: '.stylelintignore'
    };
  }

  launch (done) {
    const options = Object.assign({}, this.options);
    options.files = options.src;
    options.configPath = options.rulesFiles;

    return stylelint.lint(options).then(({ results }) => {
      this.processFiles(results);
      this.closeReporter(this.options.report);
      done();
    });
  }

  processFiles (resultsArray) {
    this.openReporter();

    resultsArray.forEach((fileResult) => {
      this.processFileResult(fileResult);
    });
  }

  processFileResult (fileResult) {
    let severity;

    this.openFileIssues(fileResult.source, null, /^(\s+)?\n$/gm);

    for (const warning of fileResult.warnings) {
      switch (warning.severity) {
        case 'error':
          severity = this.MAJOR;
          break;
        case 'warning':
          severity = this.MINOR;
          break;
        default:
          severity = this.INFO;
          break;
      }
      this.addIssue((warning.line ? warning.line : null), warning.text, '', warning.rule, severity, ReporterType.STYLELINT);

    }

  }


};
