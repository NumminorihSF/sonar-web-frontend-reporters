const Reporter = require('./reporter'),
  eslint = require('eslint'),
  glob = require('glob'),
  fs = require('fs');

module.exports = class ESLintReporter extends Reporter {
  constructor (options, projectName, projectLanguage) {
    super(options, projectName, projectLanguage);
    this.linterName = 'ES Lint';
  }

  static defaultOptions () {
    return {
      src      : 'src/**/*.js',
      report   : 'reports/sonar/eslint.json',
      rulesFile: '.eslintrc'
    };
  }

  launch () {
    this.options.eslint = this.getRCFile(this.options.rulesFile);

    glob(this.options.src, (er, files) => {
      this.processFiles(files, this.options);
    });

  }

  processFiles (fileArray, options) {
    this.openReporter(options.report);
    fileArray.forEach((file) => {
      this.processFile(file, options);
    });
    this.closeReporter(options.report);
  }

  processFile (file, options) {
    let input = this.readFile(file),
      result = eslint.linter.verify(input, options.eslint),
      severity,
      d = (new Date()).getTime(),
      index = 0;

    let fileNbViolations = this.openFileIssues(file, options.report, null, /^(\s+)?\n$/gm);
    for (let message of result) {
      switch (message.type) {
          case 2:
            severity = 'MAJOR';
            fileNbViolations[this.MAJOR]++;
            break;
          case 1:
            severity = 'MINOR';
            fileNbViolations[this.MINOR]++;
            break;
          default:
            severity = 'INFO';
            fileNbViolations[this.INFO]++;
            break;
      }


      fs.appendFileSync(options.report,
        `{
            "line": ${(message.line ? message.line : null)},
            "message": "${message.message}",
            "description": "",
            "rulekey": "${message.ruleId}",
            "severity": "${severity}",
            "reporter": "eslint",
            "creationDate": "${d}"
          }` +
        ((index < (result.length) - 1) ? ',' : ''));

      index++;
    }

    this.closeFileIssues(fileNbViolations, options.report);
  }


};
