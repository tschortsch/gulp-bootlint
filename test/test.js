/*
 * gulp-bootlint
 * https://github.com/tschortsch/gulp-bootlint
 *
 * Copyright (c) 2015 Juerg Hunziker
 * Licensed under the MIT license.
 */

/* eslint no-unused-vars: "off" */
/* global describe, it */

var bootlintPlugin = require('../');
var should = require('should');
var Vinyl = require('vinyl');
var fs = require('fs');
var path = require('path');

var getFile = function (filePath) {
  var fullFilePath = './test/' + filePath;
  return new Vinyl({
    path: fullFilePath,
    cwd: './test/',
    base: path.dirname(fullFilePath),
    contents: fs.readFileSync(fullFilePath),
  });
};

describe('gulp-bootlint', function () {
  describe('bootlintPlugin', function () {
    it('should pass file through', function (done) {
      var file = getFile('fixtures/valid-bootstrap.html');
      var stream = bootlintPlugin();
      var fileCount = 0;

      stream.on('data', function (file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.relative);
        should.exist(file.contents);
        file.path.should.equal(path.normalize('./test/fixtures/valid-bootstrap.html'));
        file.relative.should.equal('valid-bootstrap.html');
        ++fileCount;
      });

      stream.once('end', function () {
        fileCount.should.equal(1);
        done();
      });

      stream.write(file);
      stream.end();
    });

    it('should lint valid file', function (done) {
      var file = getFile('fixtures/valid-bootstrap.html');
      var issues = [];
      var stream = bootlintPlugin({
        issues: issues,
      });

      stream.on('data', function (file) {
        should.exist(file);
        issues.length.should.equal(0);
      });

      stream.once('end', function () {
        done();
      });

      stream.write(file);
      stream.end();
    });

    it('should find errors in invalid file', function (done) {
      var file = getFile('fixtures/error-bootstrap.html');
      var issues = [];
      var stream = bootlintPlugin({
        issues: issues,
      });

      stream.on('data', function () {
        issues.length.should.equal(1);
        issues[0].id.should.equal('E001');
      });
      stream.once('end', function () {
        done();
      });

      stream.write(file);
      stream.end();
    });

    it('should find warnings in invalid file', function (done) {
      var file = getFile('fixtures/warning-bootstrap.html');
      var issues = [];
      var stream = bootlintPlugin({
        issues: issues,
      });

      stream.on('data', function (file) {
        issues.length.should.equal(1);
        issues[0].id.should.equal('W009');
      });
      stream.once('end', function () {
        done();
      });

      stream.write(file);
      stream.end();
    });

    it('should find errors and warnings in invalid file', function (done) {
      var file = getFile('fixtures/error_warning-bootstrap.html');
      var issues = [];
      var stream = bootlintPlugin({
        issues: issues,
      });

      stream.on('data', function (file) {
        issues.length.should.equal(2);
        issues[0].id.should.equal('E001');
        issues[1].id.should.equal('W009');
      });
      stream.once('end', function () {
        done();
      });

      stream.write(file);
      stream.end();
    });

    it('should stop on warnings', function (done) {
      var file = getFile('fixtures/warning-bootstrap.html');
      var stream = bootlintPlugin({
        stoponwarning: true,
      });

      stream.on('warning', function (err) {
        err.message.should.equal('Lint warnings found!');
        done();
      });

      stream.write(file);
      stream.end();
    });

    it('should stop on errors', function (done) {
      var file = getFile('fixtures/error-bootstrap.html');
      var stream = bootlintPlugin({
        stoponerror: true,
      });

      stream.on('error', function (err) {
        err.message.should.equal('Lint errors found!');
        done();
      });

      stream.write(file);
      stream.end();
    });

    it('should stop if there are errors and warnings', function (done) {
      var file = getFile('fixtures/error_warning-bootstrap.html');
      var stream = bootlintPlugin({
        stoponwarning: true,
        stoponerror: true,
      });

      stream.on('error', function (err) {
        err.message.should.equal('Lint errors found!');
        done();
      });

      stream.write(file);
      stream.end();
    });

    it('should not fail on disabled ids', function (done) {
      var file = getFile('fixtures/error_warning-bootstrap.html');
      var issues = [];
      var stream = bootlintPlugin({
        disabledIds: ['E001', 'W009'],
        issues: issues,
      });

      stream.on('data', function (file) {
        issues.length.should.equal(0);
      });

      stream.once('end', function () {
        done();
      });

      stream.write(file);
      stream.end();
    });

    it('should use own report function', function (done) {
      var lintResults = {
        file: null,
        lint: null,
        isError: false,
        isWarning: false,
      };
      var myReportFn = function (file, lint, isError, isWarning, errorLocation) {
        lintResults.file = file;
        lintResults.lint = lint;
        lintResults.isError = isError;
        lintResults.isWarning = isWarning;
      };
      var file = getFile('fixtures/error-bootstrap.html');
      var stream = bootlintPlugin({
        reportFn: myReportFn,
      });

      stream.on('data', function (file) {
        should.equal(lintResults.file, file);
        should.exist(lintResults.lint);
        should.equal(lintResults.lint.id, 'E001');
        should.equal(lintResults.isError, true);
        should.equal(lintResults.isWarning, false);
      });

      stream.once('end', function () {
        done();
      });

      stream.write(file);
      stream.end();
    });

    it('should use own summary report function', function (done) {
      var lintResults = {
        file: null,
        errorCount: 0,
        warningCount: 0,
      };
      var mySummaryReportFn = function (file, errorCount, warningCount) {
        lintResults.file = file;
        lintResults.errorCount = errorCount;
        lintResults.warningCount = warningCount;
      };
      var file = getFile('fixtures/error-bootstrap.html');
      var stream = bootlintPlugin({
        summaryReportFn: mySummaryReportFn,
      });

      stream.on('data', function (file) {
        should.equal(lintResults.file, file);
        should.equal(lintResults.errorCount, 1);
        should.equal(lintResults.warningCount, 0);
      });

      stream.once('end', function () {
        done();
      });

      stream.write(file);
      stream.end();
    });
  });
});
