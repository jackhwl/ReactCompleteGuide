'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del', 'minimist', 'lazypipe']
});

// Parse the arguments to check for 'release'
var argv = $.minimist(process.argv.slice(2));
var release = (argv._.indexOf('release') == -1 ? false : true);
var local = (argv._.indexOf('local') == -1 ? false : true);


gulp.task('html', ['inject', 'partials'], function () {
  var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, conf.paths.partials, conf.files.templateCacheHtml), { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: path.join(conf.paths.tmp, conf.paths.partials),
    addRootSlash: false
  };

  var htmlFilter = $.filter('*.html', { restore: true });
  var vendorJsFilter = $.filter('**/vendor.js', { restore: true });
  var appJsFilter = $.filter('**/app.js', { restore: true });
  var envJsFilter = $.filter('**/env.js', { restore: true });
  var cssFilter = $.filter('**/*.css', { restore: true });


  gulp.task('compile', function () {
    return gulp.src('index.html')
        .pipe($.useref({}, $.lazypipe().pipe(function() {
            return $.if(['**/*.js', '!**/*.min.js'], $.uglify());
        })))
        //.pipe(gulp.dest(paths.build));

        .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
        .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
  });
  
  return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
    // .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe($.useref({}, $.lazypipe().pipe(function() {
      //$.if(release, $.sourcemaps.init());
      return $.if(['**/*.js', '!**/*.min.js'], $.uglify({ preserveComments: $.uglifySaveLicense }));
    })))
    .pipe(vendorJsFilter)
    //.pipe($.if(release, $.sourcemaps.init()))
    //.pipe($.ngAnnotate())
    //.pipe($.if(release, $.uglify({ mangle: false, compress: false, preserveComments: `license` }))).on('error', conf.errorHandler('Uglify'))
    //.pipe($.if(release, $.uglify({ preserveComments: $.uglifySaveLicense }))).on('error', conf.errorHandler('Uglify'))
    .pipe($.if(conf.userev, $.rev()))
    //.pipe($.if(release, $.sourcemaps.write('.')))
    .pipe(vendorJsFilter.restore)
    .pipe(appJsFilter)
    .pipe($.iife())
    .pipe($.if(release, $.sourcemaps.init()))
    .pipe($.ngAnnotate())
    .pipe($.if(release, $.if(['**/*.js', '!**/*.min.js'], $.uglify({ preserveComments: $.uglifySaveLicense })))).on('error', conf.errorHandler('Uglify'))
    .pipe($.if(conf.userev, $.rev()))
    .pipe($.if(release, $.sourcemaps.write('.')))
    .pipe(appJsFilter.restore)
    .pipe(envJsFilter)
    .pipe($.if(release, $.uglify({ preserveComments: $.uglifySaveLicense }))).on('error', conf.errorHandler('Uglify'))
    .pipe($.if(conf.userev, $.rev()))
    .pipe(envJsFilter.restore)
    .pipe(cssFilter)
    .pipe($.if(release, $.sourcemaps.init()))
    .pipe($.if(release, $.cssnano()))
    .pipe($.if(conf.userev, $.rev()))
    .pipe($.if(release, $.sourcemaps.write('.')))
    .pipe(cssFilter.restore)
    .pipe($.if(conf.userev, $.revReplace()))
    .pipe(htmlFilter)
    .pipe($.if(release, $.htmlmin({
      removeEmptyAttributes: true,
      removeAttributeQuotes: true,
      removeComments: true,
      collapseBooleanAttributes: true,
      collapseWhitespace: true
    })))
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
  });

gulp.task('clean', function () {
  return $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')]);
});

gulp.task('mode', function () {
  if (release) {
    $.util.log( $.util.colors.red('RUNNING IN RELEASE MODE') );
  } else {
    $.util.log( $.util.colors.green('RUNNING IN DEBUG MODE') );
  }
});

gulp.task('release', [], function () {
  gulp.start('build');
});

gulp.task('local', [], function () {
  gulp.start('build');
});

gulp.task('build', ['clean'], function () {
  gulp.start('buildapp');
});

gulp.task('buildapp', ['mode', 'html', 'merge']);
