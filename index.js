/*
 * gulp-bootlint
 * https://github.com/tschortsch/gulp-bootlint
 */

'use strict';
var colors = require('ansi-colors');
var PluginError = require('plugin-error');
var through = require('through2');
var merge = require('merge');
var bootlint = require('bootlint');
var log = require('log');
require('log-node')(); // initialize log writer

// consts
var PLUGIN_NAME = 'gulp-bootlint';

function gulpBootlint (options) {
  var hasError = false;
  var hasWarning = false;
  var stream;

  /**
   * Reporter function for linting errors and warnings.
   *
   * @param file Current file object.
   * @param lint Current linting error.
   * @param isError True if this is an error.
   * @param isWarning True if this is a warning.
   * @param errorLocation Error location object.
   */
  var defaultReportFn = function (file, lint, isError, isWarning, errorLocation) {
    var lintId = (isError) ? colors.bgRed(colors.white(lint.id)) : colors.bgYellow(colors.white(lint.id));
    var message = '';
    if (errorLocation) {
      message = file.path + ':' + (errorLocation.line + 1) + ':' + (errorLocation.column + 1) + ' ' + lintId + ' ' + lint.message;
    } else {
      message = file.path + ': ' + lintId + ' ' + lint.message;
    }

    if (isError) {
      log.error(message);
    } else {
      log.warning(message);
    }
  };

  /**
   * Reporter function for linting summary.
   *
   * @param file File which was linted.
   * @param errorCount Total count of errors in file.
   * @param warningCount Total count of warnings in file.
   */
  var defaultSummaryReportFn = function (file, errorCount, warningCount) {
    if (errorCount > 0 || warningCount > 0) {
      var message = '';
      if (errorCount > 0) {
        message += colors.red(errorCount + ' lint ' + (errorCount === 1 ? 'error' : 'errors'));
      }

      if (warningCount > 0) {
        if (errorCount > 0) {
          message += ' and ';
        }
        message += colors.yellow(warningCount + ' lint ' + (warningCount === 1 ? 'warning' : 'warnings'));
      }
      message += ' found in file ' + file.path;
      log.notice(message);
    } else {
      log.info(colors.green(file.path + ' is lint free!'));
    }
  };

  options = merge({
    stoponerror: false,
    stoponwarning: false,
    disabledIds: [],
    issues: [],
    reportFn: defaultReportFn,
    summaryReportFn: defaultSummaryReportFn,
  }, options);

  // creating a stream through which each file will pass
  stream = through.obj(function (file, enc, cb) {
    var errorCount = 0;
    var warningCount = 0;

    if (file.isNull()) {
      return cb(null, file);
    }

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }

    var reporter = function (lint) {
      var isError = (lint.id[0] === 'E');
      var isWarning = (lint.id[0] === 'W');
      var errorElementsAvailable = false;

      if (lint.elements) {
        lint.elements.each(function (_, element) {
          if (options.reportFn) {
            options.reportFn(file, lint, isError, isWarning, element.startLocation);
          }
          errorElementsAvailable = true;
        });
      }
      if (!errorElementsAvailable && options.reportFn) {
        options.reportFn(file, lint, isError, isWarning, null);
      }

      if (isError) {
        ++errorCount;
        hasError = true;
      }
      if (isWarning) {
        ++warningCount;
        hasWarning = true;
      }
      options.issues.push(lint);
    };

    log.info(colors.gray('Linting file ' + file.path));
    bootlint.lintHtml(file.contents.toString(), reporter, options.disabledIds);

    if (options.summaryReportFn) {
      options.summaryReportFn(file, errorCount, warningCount);
    }

    return cb(null, file);
  }, function (cb) {
    if (hasError && options.stoponerror) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Lint errors found!'));
    }
    if (hasWarning && options.stoponwarning) {
      this.emit('warning', new PluginError(PLUGIN_NAME, 'Lint warnings found!'));
    }

    return cb();
  });

  return stream;
}

// exporting the plugin
module.exports = gulpBootlint;
