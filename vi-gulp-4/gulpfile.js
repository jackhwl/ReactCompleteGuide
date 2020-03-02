
var fs = require('fs');
var path = require('path');
var gulp = require('gulp'), 
    plugins		= require('gulp-load-plugins')();

//http://gunargessner.com/gulp-release
/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
fs.readdirSync('./gulp/tasks').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  gulp.task(path.parse(file).name, require('./gulp/tasks/' + file)());
});

gulp.task('default', gulp.series(
	 'clean')
);