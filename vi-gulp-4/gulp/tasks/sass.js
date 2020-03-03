// gulp.task('sass', [], function () {
//     return gulp.src(path.join(conf.paths.src, '/*.scss'))
//       .pipe(wiredep(_.extend({}, getWiredepOptions()))).on('error', conf.errorHandler('wiredep'))
//       .pipe($.sass())
//       .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
//   });
var path = require('path')
var conf = require('../conf')
var gulp = require('gulp')
var wiredep = require('wiredep').stream
//var _ = require('lodash')

var $ = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'minimist']
    }
)

var argv = $.minimist(process.argv.slice(2));
var release = (argv._.indexOf('release') == -1 ? false : true);

var getWiredepOptions = function() {
    var isProduction = release;
    var options = {
        //exclude: ['/Outlayer/'],
        directory: 'bower_components',
        //bowerJson: bowerJson,
        //ignorePath: '..',
        fileTypes: {
        html: {
            block: /(([ \t]*)<!--\s*bower:*(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endbower\s*-->)/gi,
            detect: {
            js: /<script.*src=['"]([^'"]+)/gi,
            css: /<link.*href=['"]([^'"]+)/gi,
            scss: /@import\s(.+scss)/gi
            },
            replace: {
            js: function(filePath) {
                if (isProduction && filePath.indexOf(".min") === -1) { // isProduction is a variable that is set to determine build type. Its good practise to use unminified files during development 
                var minFilePath = filePath.replace('.js', '.min.js');
                var fullPath = path.join(process.cwd(), minFilePath.substring(3));
                if (exists(fullPath)) {
                    return '<script src="' + minFilePath + '"></script>';
                } else {
                    return '<script src="' + filePath + '"></script>';
                }
                } else {
                    return '<script src="' + filePath + '"></script>';
                }
            },
            css: function(filePath) {
                if (isProduction && filePath.indexOf(".min") === -1) {
                var minFilePath = filePath.replace('.css', '.min.css');
                var fullPath = path.join(process.cwd(), minFilePath.substring(3));
                if (exists(fullPath)) {
                    return '<link rel="stylesheet" href="' + minFilePath + '" />';
                } else {
                    return '<link rel="stylesheet" href="' + filePath + '" />';
                }
                } else {
                    return '<link rel="stylesheet" href="' + filePath + '" />';
                }
            },
            scss: function(filePath) {
                return '<link rel="stylesheet" href="' + filePath + '" />';
                // return '@import "' + filePath + '"';
            }
            }
        },    
        scss: {
            block: /(([ \t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
            detect: {
            css: /@import\s['"](.+css)['"]/gi,
            sass: /@import\s['"](.+sass)['"]/gi,
            scss: /@import\s['"](.+scss)['"]/gi
            },
            replace: {
            css: '@import "{{filePath}}";',
            sass: '@import "{{filePath}}";',
            scss: '@import "{{filePath}}";'
            }
        },
        },
        dependencies: true,
        devDependencies: false,
        onError: function(err) {
            // log this
        },
        onFileUpdated: function(filePath) {
            // log this
        }
        }
    //};
    return options;
}
      
module.exports = function() {
    return function () {
        var stream = 
        // -------------------------------------------- Start Task
        gulp.src(path.join(conf.paths.src, '/*.scss'))
        .pipe(wiredep(Object.assign({}, getWiredepOptions()))).on('error', conf.errorHandler('wiredep'))
        .pipe($.sass())
        .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')))
        // ---------------------------------------------- End Task
        return stream
    }
}