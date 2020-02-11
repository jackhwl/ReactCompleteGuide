
'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del', 'minimist']
});

// Parse the arguments to check for 'release'
var argv = $.minimist(process.argv.slice(2));
var release = (argv._.indexOf('release') == -1 ? false : true);
var local = (argv._.indexOf('local') == -1 ? false : true);

gulp.task('partials', function () {
  return gulp.src([
		path.join(conf.paths.src, '/app/**/*.html')
		//path.join(conf.paths.tmp, '/serve/app/**/*.html')
	  ])
  	// .pipe($.if(local, $.stripCode(conf.stripCodePattern("start mvc view image", "end mvc view image") )))
  	// .pipe($.if(!local, $.stripCode(conf.stripCodePattern("start spa view image", "end spa view image") )))
    .pipe($.if(!local, $.stripCode(conf.stripCodePattern("start debug home menu", "end debug home menu") )))
    .pipe($.if(local, $.stripCode(conf.stripCodePattern("start release home menu", "end release home menu") )))
    .pipe($.if(release, $.htmlmin({
      removeEmptyAttributes: true,
      removeAttributeQuotes: true,
      collapseBooleanAttributes: true,
      collapseWhitespace: true
    })))
    .pipe($.angularTemplatecache(conf.files.templateCacheHtml, {
      module: 'app',
      root: 'app'
    }))
    .pipe(gulp.dest(path.join(conf.paths.tmp, conf.paths.partials)));
});