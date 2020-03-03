
var fs = require('fs');
var path = require('path');
var gulp = require('gulp'), 
    plugins		= require('gulp-load-plugins')();

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'minimist']
    })
//http://gunargessner.com/gulp-release
/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */

 // Parse the arguments to check for 'release'
var argv = $.minimist(process.argv.slice(2));
var release = (argv._.indexOf('release') == -1 ? false : true);

fs.readdirSync('./gulp/tasks')
    .filter(function(file) {
        return (/\.(js|coffee)$/i).test(file);
    })
    .map(function(file) {
        gulp.task(path.parse(file).name, require('./gulp/tasks/' + file)())
    })

gulp.task('mode', async function () {
    if (release) {
        $.util.log( $.util.colors.red('RUNNING IN RELEASE MODE') );
    } else {
        $.util.log( $.util.colors.green('RUNNING IN DEBUG MODE') );
    }
});

gulp.task('buildapp', gulp.series('mode'));

gulp.task('build', gulp.series('clean', 'buildapp'));

gulp.task('release', gulp.series('build'));
  
gulp.task('debug', gulp.series('build'));

gulp.task('default', gulp.series('debug'));