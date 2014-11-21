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
        stoponerror: false,
        relaxerror: []
    };

    var hardfail = false;

    // creating a stream through which each file will pass
    var stream = through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return;
        }

        var reporter = function (lint) {
            var lintId = (lint.id[0] === 'E') ? chalk.bgGreen.white(lint.id) : chalk.bgRed.white(lint.id);
            var output = false;
            if (lint.elements) {
                lint.elements.each(function (_, element) {
                    var loc = element.startLocation;
                    gutil.log(file + ":" + (loc.line + 1) + ":" + (loc.column + 1), lintId, lint.message);
                    output = true;
                });
            }
            if (!output) {
                gutil.log(file + ":", lintId, lint.message);
                if (options.stoponerror) {
                    hardfail = true;
                }
            }
        };


        bootlint.lintHtml(file, reporter, options.relaxerror);

        return cb(null, file);
    });

    return stream;
};

// exporting the plugin
module.exports = gulpBootlint;