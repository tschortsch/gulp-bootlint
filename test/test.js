/*
 * gulp-bootlint
 * https://github.com/tschortsch/gulp-bootlint
 *
 * Copyright (c) 2014 Juerg Hunziker
 * Licensed under the MIT license.
 */

var bootlintPlugin = require('../');
var should = require('should');
var gutil = require('gulp-util');
var fs = require('fs');
var path = require('path');
require('mocha');

var getFile = function(filePath) {
  var fullFilePath = './test/' + filePath;
  return new gutil.File({
    path: fullFilePath,
    cwd: './test/',
    base: path.dirname(fullFilePath),
    contents: fs.readFileSync(fullFilePath)
  });
};

describe('gulp-bootlint', function() {
  describe('bootlintPlugin', function() {
    it('should pass file through', function(done) {
      var file = getFile('fixtures/valid-bootstrap.html'),
          stream = bootlintPlugin(),
          fileCount = 0;

      stream.on('data', function(file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.relative);
        should.exist(file.contents);
        should.exist(file.bootlint);
        should.equal(file.bootlint.success, true);
        file.path.should.equal('./test/fixtures/valid-bootstrap.html');
        file.relative.should.equal('valid-bootstrap.html');
        ++fileCount;
      });

      stream.once('end', function() {
        fileCount.should.equal(1);
        done();
      });

      stream.write(file);
      stream.end();
    });

    it('should send failure status', function(done) {
      var file = getFile('fixtures/invalid-bootstrap.html'),
          stream = bootlintPlugin(),
          fileCount = 0;

      stream.on('data', function(file) {
        ++fileCount;
        should.exist(file.bootlint);
        should.exist(file.bootlint.success);
        file.bootlint.success.should.equal(false);
        should.exist(file.bootlint.issues);
        file.bootlint.issues.length.should.equal(1);
        file.bootlint.issues[0].id.should.equal('W009');
      });
      stream.once('end', function() {
        fileCount.should.equal(1);
        done();
      });

      stream.write(file);
      stream.end();
    });
  })
});