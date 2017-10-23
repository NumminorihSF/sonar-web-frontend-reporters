const ReporterType = require('./reporter.enum'),
  ESLintReporter = require('./reporters/eslint.reporter');

/**
 * Handle the reporters creation.
 */
class ReporterFactory {

  /**
   * Instantiante a reporter
   *
   * @param   {ReporterType}  type              Reporter type.
   * @param   {Object}        options           User specific options.
   * @param   {string}        projectName       The project name, coming from `.sreporterrc` file and used later by SonarQube.
   * @returns {Reporter}                        Instance of `Reporter`.
   */
  static create (type, options, projectName) {
    let reporter, opts;

    switch (type) {
      case ReporterType.ESLINT:
        opts = ReporterFactory.mergeOptions(options, ESLintReporter.defaultOptions());
        reporter = new ESLintReporter(opts, projectName);
        break;

      default:
        throw new Error(`Unknown reporter '${type}'`);
    }

    return reporter;
  }

  /**
   * Merge the user specific options with the default ones of the reporter.
   * Prioritize the user options.
   *
   * @param   {Object}        options         User specific options
   * @param   {Object}        defaultOptions  Default reporter options
   * @returns {Object|false}                  Merged options; Or FALSE if this reporter should be ignored
   */
  static mergeOptions (options, defaultOptions) {
    if (options === true) {
      return defaultOptions;
    } else if (options) {
      return Object.assign(defaultOptions, options);
    }

    return false;
  }

}

module.exports = ReporterFactory;
