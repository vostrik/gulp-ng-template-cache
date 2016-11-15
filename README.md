# gulp-ng-template-cache
Put ng-templates from script to AngularJS $templateCache

## Install

Install with [npm](https://www.npmjs.com/package/gulp-ng-template-cache)

```
npm install gulp-ng-template-cache --save-dev
```

## Example

**gulpfile.js**
```js
var ngTemplateCache = require('gulp-ng-template-cache');

gulp.task('default', function () {
  return gulp.src('templates/**/*.html')
    .pipe(ngTemplateCache())
    .pipe(gulp.dest('public'));
});
```

## API

### options

#### moduleName - {string} [moduleName='templates']

> Name of AngularJS module.

#### bundleName - {string} [bundleName='templatecache.js']

> Name of js bundle with templates.