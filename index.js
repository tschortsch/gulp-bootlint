/*
 * gulp-bootlint
 * https://github.com/tschortsch/gulp-bootlint
 *
 * Copyright (c) 2014 Juerg Hunziker
 * Licensed under the MIT license.
 */

'use strict';
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var through = require('through2');
var chalk = require('chalk');
var bootlint = require('bootlint');

// consts
var PLUGIN_NAME = 'gulp-bootlint';

function gulpBootlint(options) {
  options = options || {
    disabledIds: []
  };

  // creating a stream through which each file will pass
  var stream = through.obj(function (file, enc, cb) {
    var errorCount = 0;

    if (file.isNull()) {
      return cb(null, file);
    }

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }

    var reporter = function (lint) {
      var lintId = (lint.id[0] === 'E') ? chalk.bgRed.white(lint.id) : chalk.bgYellow.white(lint.id),
          errorElementsAvailable = false;

      if (lint.elements) {
        lint.elements.each(function (_, element) {
          var errorLocation = element.startLocation;
          gutil.log(file.path + ":" + (errorLocation.line + 1) + ":" + (errorLocation.column + 1), lintId, lint.message);
          errorElementsAvailable = true;
        });
      }
      if (!errorElementsAvailable) {
        gutil.log(file.path + ":", lintId, lint.message);
      }

      ++errorCount;
      file.bootlint.success = false;
      file.bootlint.issues.push(lint);
    };

    gutil.log(chalk.gray('Linting file ' + file.path));
    file.bootlint = { success: true, issues: [] };
    bootlint.lintHtml(file.contents.toString(), reporter, options.disabledIds);

    if(errorCount > 0) {
      gutil.log(chalk.red(errorCount + ' lint error(s) found in file ' + file.path));
    } else {
      gutil.log(chalk.green(file.path + ' is lint free!'));
    }

    return cb(null, file);
  });



  return stream;
};

// exporting the plugin
module.exports = gulpBootlint;