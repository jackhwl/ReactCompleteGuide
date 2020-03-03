// 'use strict';

// var path = require('path');
// var gulp = require('gulp');
// var conf = require('./conf');

// var browserSync = require('browser-sync');

// var $ = require('gulp-load-plugins')();


// gulp.task('scripts-reload', function() {
//   return buildScripts()
//     .pipe(browserSync.stream());
// });

// gulp.task('scripts', function() {
//   return buildScripts();
// });

// function buildScripts() {
//   return gulp.src(path.join(conf.paths.src, '/**/*.js'))
//     .pipe($.eslint())
//     .pipe($.eslint.format())
//     .pipe($.size())
// }

var path = require('path')
var conf = require('../conf')
var gulp = require('gulp')

var $ = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'minimist']
    }
)

module.exports = function() {
    return function () {
        var stream = 
        // -------------------------------------------- Start Task
        gulp.src(path.join(conf.paths.src, '/**/*.js'))
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.size())
        // ---------------------------------------------- End Task
        return stream
    }
}