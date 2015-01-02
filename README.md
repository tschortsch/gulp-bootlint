# gulp-bootlint
[![Build Status](https://travis-ci.org/tschortsch/gulp-bootlint.svg?branch=master)](https://travis-ci.org/tschortsch/gulp-bootlint) [![npm version](https://badge.fury.io/js/gulp-bootlint.svg)](http://badge.fury.io/js/gulp-bootlint) [![Dependency Status](https://david-dm.org/tschortsch/gulp-bootlint.svg)](https://david-dm.org/tschortsch/gulp-bootlint) [![devDependency Status](https://david-dm.org/tschortsch/gulp-bootlint/dev-status.svg)](https://david-dm.org/tschortsch/gulp-bootlint#info=devDependencies)

A gulp wrapper for Bootlint, the HTML linter for Bootstrap projects.

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

### options.disabledIds

* Type: `Array`
* Default: `[]`

Array of [bootlint problem ID codes](https://github.com/twbs/bootlint/wiki) (as `Strings`) to explicitly ignore.

#### Example:

```javascript
var gulp = require('gulp');
var bootlint  = require('gulp-bootlint');

gulp.task('bootlint', function() {
    return gulp.src('./index.html')
        .pipe(bootlint({
            disabledIds: ['W009', 'E007']
        }));
});

```

## Release History

* 2015-01-01 - v0.2.1: Code cleanup
* 2015-01-01 - v0.2.0: Updated bootlint to v0.9.1
* 2015-01-01 - v0.1.1: Fail on linting error.
* 2014-11-23 - v0.1.0: First public release.

## License

Copyright (c) 2015 Jürg Hunziker. Licensed under the MIT License.