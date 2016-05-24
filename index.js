/*
 * gulp-bootlint
 * https://github.com/tschortsch/gulp-bootlint
 *
 * Copyright (c) 2015 Juerg Hunziker
 * Licensed under the MIT license.
 */

'use strict';
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var through = require('through2');
var Log = require('log');
var merge = require('merge');
var bootlint = require('bootlint');

// consts
var PLUGIN_NAME = 'gulp-bootlint';

function gulpBootlint(options) {
    var hasError = false,
        hasWarning = false,
        log, stream;

    /**
     * Reporter function for linting errors and warnings.
     *
     * @param file Current file object.
     * @param lint Current linting error.
     * @param isError True if this is an error.
     * @param isWarning True if this is a warning.
     * @param errorLocation Error location object.
     */
    var defaultReportFn = function(file, lint, isError, isWarning, errorLocation) {
        var lintId = (isError) ? gutil.colors.bgRed.white(lint.id) : gutil.colors.bgYellow.white(lint.id);
        var message = "";
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
    var defaultSummaryReportFn = function(file, errorCount, warningCount) {
        if (errorCount > 0 || warningCount > 0) {
            var message = '';
            if (errorCount > 0) {
                message += gutil.colors.red(errorCount + ' lint ' + (errorCount === 1 ? 'error' : 'errors'));
            }

            if (warningCount > 0) {
                if (errorCount > 0) {
                    message += ' and ';
                }
                message += gutil.colors.yellow(warningCount + ' lint ' + (warningCount === 1 ? 'warning' : 'warnings'));
            }
            message += ' found in file ' + file.path;
            log.notice(message);
        } else {
            log.info(gutil.colors.green(file.path + ' is lint free!'));
        }
    };

    options = merge({
        stoponerror: false,
        stoponwarning: false,
        loglevel: 'error',
        disabledIds: [],
        issues: [],
        reportFn: defaultReportFn,
        summaryReportFn: defaultSummaryReportFn
    }, options);

    log = new Log(options.loglevel);

    // creating a stream through which each file will pass
    stream = through.obj(function (file, enc, cb) {
        var errorCount = 0,
            warningCount = 0;

        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return cb();
        }

        var reporter = function (lint) {
            var isError = (lint.id[0] === 'E'),
                isWarning = (lint.id[0] === 'W'),
                errorElementsAvailable = false;

            if (lint.elements) {
                lint.elements.each(function (_, element) {
                    if(options.reportFn){
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

        log.info(gutil.colors.gray('Linting file ' + file.path));
        bootlint.lintHtml(file.contents.toString(), reporter, options.disabledIds);

        if(options.summaryReportFn){
            options.summaryReportFn(file, errorCount, warningCount);
        }

        return cb(null, file);
    }, function (cb) {
        if (hasError && options.stoponerror ) {
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
