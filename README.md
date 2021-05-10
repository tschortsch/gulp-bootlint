# gulp-bootlint

[![npm version](https://badge.fury.io/js/gulp-bootlint.svg)](https://badge.fury.io/js/gulp-bootlint)
[![Build Status](https://github.com/tschortsch/gulp-bootlint/workflows/Lint%20Test%20Deploy/badge.svg?branch=master)](https://github.com/tschortsch/gulp-bootlint/actions?query=workflow%3A%22Lint+Test+Deploy%22+branch%3Amaster)

A gulp wrapper for [Bootlint](https://github.com/twbs/bootlint), the HTML linter for Bootstrap projects.

## Requirements

* Node.js >= 10.x

## First steps

If you are familiar with [gulp](https://gulpjs.com/) just install the plugin from [npm](https://npmjs.org/package/gulp-bootlint) with the following command:

```
npm install gulp-bootlint --save-dev
```

Otherwise check out the [Getting Started](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md#getting-started) guide of gulp first.

## Create a new gulp task

After installing the plugin you can create a new gulp task in your `gulpfile.js` like this:

```javascript
var gulp = require('gulp');
var bootlint = require('gulp-bootlint');

gulp.task('bootlint', function() {
  return gulp.src('./index.html')
    .pipe(bootlint());
});
```

## Options

You can pass the following options as a single object when calling the bootlint plugin.

### options.stoponerror

* Type: `Boolean`
* Default: `false`

Stops the gulp task if there are errors in the linted file.

### options.stoponwarning

* Type: `Boolean`
* Default: `false`

Stops the gulp task if there are warnings in the linted file.

### options.disabledIds

* Type: `String[]`
* Default: `[]`

Array of [bootlint problem ID codes](https://github.com/twbs/bootlint/wiki) (as `Strings`) to explicitly ignore.

### options.issues

* Type: `Array` of `LintWarning` and `LintError` objects
* Default: `[]`

All found issues (Objects of type `LintWarning` and `LintError`) are stored in this array.
You can access and use them after executing this module.

The classes `LintWarning` and `LintError` are described here https://github.com/twbs/bootlint#api-documentation.

### options.reportFn

* Type: `Function`
* Parameter:
  * `Object` **file** - File with linting error.
  * `Object` **lint** - Linting error.
  * `Boolean` **isError** - True if current linting problem is an error.
  * `Boolean` **isWarning** - True if current linting problem is a warning.
  * `Object` **errorLocation** - Error location in file.

A function that will log out the lint errors to the console. Only use this if you want to customize how the lint errors are reported.
If desired, this can be turned off entirely by setting `reportFn: false`.

### options.summaryReportFn

* Type: `Function`
* Parameter:
  * `Object` **file** - File which was linted.
  * `Integer` **errorCount** - Total count of errors in the file.
  * `Integer` **warningCount** - Total count of warnings in the file.

A function that will log out the final lint error/warning summary to the console. Only use this if you want to customize how this is reported.
If desired, this can be turned off entirely by setting `summaryReportFn: false`.

### Example of options usage:

```javascript
var gulp = require('gulp');
var bootlint = require('gulp-bootlint');

gulp.task('bootlint', function () {
  var fileIssues = [];
  return gulp.src('./index.html')
    .pipe(bootlint({
      stoponerror: true,
      stoponwarning: true,
      disabledIds: ['W009', 'E007'],
      issues: fileIssues,
      reportFn: function (file, lint, isError, isWarning, errorLocation) {
        var message = (isError) ? 'ERROR! - ' : 'WARN! - ';
        if (errorLocation) {
          message += file.path + ' (line:' + (errorLocation.line + 1) + ', col:' + (errorLocation.column + 1) + ') [' + lint.id + '] ' + lint.message;
        } else {
          message += file.path + ': ' + lint.id + ' ' + lint.message;
        }
        console.log(message);
      },
      summaryReportFn: function(file, errorCount, warningCount) {
        if (errorCount > 0 || warningCount > 0) {
          console.log('please fix the ' + errorCount + ' errors and ' + warningCount + ' warnings in ' + file.path);
        } else {
          console.log('No problems found in ' + file.path);
        }
      },
    }));
});
```

## Log level

To set the log level please use the `LOG_LEVEL` environment variable before starting your gulp task:

```
$ LOG_LEVEL=error npm run gulp
```

Available log levels are listed here: https://github.com/medikoo/log#available-log-levels

## Changelog

* 2021-05-10 - v1.1.1
  * **Dropped support for Node.js versions < 10**
  * Updated `merge` package to v2.1.1
  * Updated `through2` package to v4.0.2
  * Bumped dependency versions:
    * Updated `eslint` package to v7.26.0
    * Updated `eslint-config-gulp` package to v5.0.1
    * Updated `mocha` package to v8.4.0
    * Updated `vinyl` package to v2.2.1
* 2020-05-07 - v1.1.0
  * Updated `bootlint` to v1.1.0
  * Bumped other dependency versions:
    * Updated `eslint-config-gulp` package to v4.0.0
    * Updated `mocha` package to v7.1.2
* 2019-12-12 - v1.0.0
    * Updated `bootlint` to v1.0.0
    * Updated `log` package to v6.0.0
    * Dropped `loglevel` option since it's not supported anymore by the new `log` package.
      To set the log level please use the `LOG_LEVEL` environment variable before running your gulp task (see: https://github.com/tschortsch/gulp-bootlint#log-level).
    * Bumped other dependency versions
* 2019-06-26 - v0.11.0
    * **Dropped support for Node.js versions < 8**
    * Updated Bootlint to v0.16.6
    * Bumped dependency versions
* 2018-12-15 - v0.10.2: Bumped dependency versions
* 2018-10-02 - v0.10.1: Updated bootlint to v0.15.1 / Bumped dependency versions
* 2018-04-24 - v0.9.0: Replaced deprecated gulp-util (thanks to [TheDancingCode](https://github.com/TheDancingCode))
* 2017-02-01 - v0.8.1: Bumped dependency versions
* 2016-05-24 - v0.8.0: Possibility to provide array where found issues are stored
* 2016-04-12 - v0.7.2: Bumped dependency versions
* 2015-11-25 - v0.7.1: Updated Bootlint to v0.14.2
* 2015-11-16 - v0.7.0: Updated Bootlint to v0.14.1 / Added options to define reporters (thx @chrismbarr) / Bumped dependency versions
* 2015-07-28 - v0.6.4: Bumped dependency versions
* 2015-06-21 - v0.6.0: Added option to define log level
* 2015-06-18 - v0.5.1: Bumped dependency versions
* 2015-04-28 - v0.5.0: Added parameters to stop task on error or warning
* 2015-04-25 - v0.4.0: Updated Bootlint to v0.12.0 / Bumped other dependency versions
* 2015-02-24 - v0.3.0: Updated Bootlint to v0.11.0 / Bumped other dependency versions
* 2015-01-26 - v0.2.3: Updated Bootlint to v0.10.0
* 2015-01-07 - v0.2.2: Updated dependencies
* 2015-01-01 - v0.2.1: Code cleanup
* 2015-01-01 - v0.2.0: Updated Bootlint to v0.9.1
* 2015-01-01 - v0.1.1: Fail on linting errors
* 2014-11-23 - v0.1.0: First public release
