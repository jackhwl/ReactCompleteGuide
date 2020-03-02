
var fs = require('fs');
var gulp = require('gulp'), 
    plugins		= require('gulp-load-plugins')();

//http://gunargessner.com/gulp-release
/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
fs.readdirSync('./tasks').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./tasks/' + file);
});

function getTask(task) {
	return require('./tasks/' + task)(gulp, plugins);
}

gulp.task('clean',      getTask('clean'));

gulp.task('default', gulp.series(
	 'clean')
);

function defaultTask(cb) {
    cb();
}

//exports.default = defaultTask