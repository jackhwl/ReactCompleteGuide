var path = require('path')
var conf = require('../conf')
var config = require('../config')
var gulp = require('gulp')
var wiredep = require('wiredep').stream

var $ = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'minimist']
    }
)

var argv = $.minimist(process.argv.slice(2));
var release = (argv._.indexOf('release') == -1 ? false : true);

module.exports = function() {
    return function () {
        var stream = 
        // -------------------------------------------- Start Task
        gulp.src(path.join(conf.paths.src, '/*.scss'))
        .pipe(wiredep(Object.assign({}, config.wiredepOptions(release)))).on('error', conf.errorHandler('wiredep'))
        .pipe($.sass())
        .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')))
        // ---------------------------------------------- End Task
        return stream
    }
}