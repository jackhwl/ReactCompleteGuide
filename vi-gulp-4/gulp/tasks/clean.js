// =========================================================
// Gulp Task: clean
// Description: deletes dist folder
// npm install --save-del del gulp-load-plugins
// =========================================================

var gulp = require('gulp');
//var conf = require('./conf');

// var $ = require('gulp-load-plugins')({
//   pattern: ['gulp-*', 'del']
// });

//var //config              = require('../config.js'),
//   del                 = require('del');
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del', 'minimist', 'lazypipe']
  });

module.exports = function() {
    return function (cb) {
    var stream = 
// -------------------------------------------- Start Task
        // del(config.clean.folders, cb);
        $.del('./dist/', cb);
// ---------------------------------------------- End Task
    return stream;
    };
};

//gulp.task('clean',      clean());

// gulp.task('clean', function () {
//     return $.del([path.join(conf.paths.dist, '/')
//       , path.join(conf.paths.tmp, '/')
//     ]);
//   });