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


gulp.task('clean', function () {
  return $.del([path.join(conf.paths.dist, '/')
    , path.join(conf.paths.tmp, '/')
  ]);
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

gulp.task('buildapp', ['mode', 'html']);

gulp.task('build', ['clean'], function () {
  gulp.start('buildapp');
});
