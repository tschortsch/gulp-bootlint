# gulp-bootlint
[![Build Status](https://travis-ci.org/tschortsch/gulp-bootlint.svg?branch=master)](https://travis-ci.org/tschortsch/gulp-bootlint) [![npm version](https://badge.fury.io/js/gulp-bootlint.svg)](http://badge.fury.io/js/gulp-bootlint) [![Dependency Status](https://david-dm.org/tschortsch/gulp-bootlint.svg)](https://david-dm.org/tschortsch/gulp-bootlint) [![devDependency Status](https://david-dm.org/tschortsch/gulp-bootlint/dev-status.svg)](https://david-dm.org/tschortsch/gulp-bootlint#info=devDependencies)

A gulp wrapper for [Bootlint](https://github.com/twbs/bootlint), the HTML linter for Bootstrap projects.

## First steps

If you are familiar with [gulp](http://gulpjs.com/) just install the plugin from [npm](https://npmjs.org/package/gulp-bootlint) with the following command:

```
npm install gulp-bootlint --save-dev
```

Otherwise check out the [Getting Started](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md#getting-started) guide of gulp first.

## Create a new gulp task

After installing the plugin you can create a new gulp task in your `gulpfile.js` like this:

```javascript
var gulp = require('gulp');
var bootlint  = require('gulp-bootlint');

gulp.task('bootlint', function() {
    return gulp.src('./index.html')
        .pipe(bootlint());
});
```

## Options

You can pass the following options as a single object when calling the bootlint plugin.

### options.stoponwarning

* Type: `Boolean`
* Default: `false`

Stops the gulp task if there are warnings in the linted file.

### options.stoponerror

* Type: `Boolean`
* Default: `false`

Stops the gulp task if there are errors in the linted file.

### options.disabledIds

* Type: `Array`
* Default: `[]`

Array of [bootlint problem ID codes](https://github.com/twbs/bootlint/wiki) (as `Strings`) to explicitly ignore.

### Example of options usage:

```javascript
var gulp = require('gulp');
var bootlint  = require('gulp-bootlint');

gulp.task('bootlint', function() {
    return gulp.src('./index.html')
        .pipe(bootlint({
            stoponwarning: true,
            stoponerror: true,
            disabledIds: ['W009', 'E007']
        }));
});
```

## Release History

* 2015-04-25 - v0.4.0: Updated Bootlint to v0.12.0 / Bumped other dependency versions
* 2015-02-24 - v0.3.0: Updated Bootlint to v0.11.0 / Bumped other dependency versions
* 2015-01-26 - v0.2.3: Updated Bootlint to v0.10.0
* 2015-01-07 - v0.2.2: Updated dependencies
* 2015-01-01 - v0.2.1: Code cleanup
* 2015-01-01 - v0.2.0: Updated Bootlint to v0.9.1
* 2015-01-01 - v0.1.1: Fail on linting errors
* 2014-11-23 - v0.1.0: First public release

## License

Copyright (c) 2015 Jürg Hunziker. Licensed under the MIT License.