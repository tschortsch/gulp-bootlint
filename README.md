# gulp-bootlint

A gulp wrapper for Bootlint, the HTML linter for Bootstrap projects.

## Installation

Install via [npm](https://npmjs.org/package/gulp-bootlint):

```
npm install gulp-bootlint --save-dev
```

## Usage

```javascript
var gulp = require('gulp');
var bootlint  = require('gulp-bootlint');

gulp.task('default', function() {
    gulp.src('./index.html')
        .pipe(bootlint());
});
```

## Options

### options.disabledIds

* Type: `Array`
* Default: `[]`

Array of [bootlint problem ID codes](https://github.com/twbs/bootlint/wiki) (`String`s) to explicitly ignore.

Example:

```javascript
var gulp = require('gulp');
var bootlint  = require('gulp-bootlint');

gulp.task('default', function() {
    gulp.src('./index.html')
        .pipe(bootlint({
            disabledIds: ['W009', 'E007']
        }));
});

```
