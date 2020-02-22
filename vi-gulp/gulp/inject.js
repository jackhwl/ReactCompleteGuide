'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'minimist']
});

var wiredep = require('wiredep').stream;
var _ = require('lodash');

var exists = require('fs-exists-sync');
var fs = require('fs-extra');

// Parse the arguments to check for 'release'
var argv = $.minimist(process.argv.slice(2));
var release = (argv._.indexOf('release') == -1 ? false : true);
var local = (argv._.indexOf('local') == -1 ? false : true);

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

gulp.task('less', [], function () {
  return gulp.src([path.join(conf.paths.src, '/app/**/*.less')], { read: true })
    .pipe($.less({paths: [ path.join(conf.paths.src, '/app/styles') ]}))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});

gulp.task('sass', [], function () {
  return gulp.src(path.join(conf.paths.src, '/*.scss'))
    .pipe(wiredep(_.extend({}, getWiredepOptions()))).on('error', conf.errorHandler('wiredep'))
    .pipe($.sass())
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});

gulp.task('inject', ['sass', 'scripts'], function () {
  var injectStyles = gulp.src([
    path.join(conf.paths.src, '/app/**/*.css'),
    //path.join(conf.paths.tmp, '/serve/**/*.css')
    //path.join(conf.paths.tmp, '/serve/**/*.scss')
  ], { read: false });

  var injectStylesOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };
	
  var injectEnviormentScript = gulp.src([
    path.join(conf.paths.src, '/app/**/', local ? conf.files.devenv : conf.files.env)
  ]);

  var injectEnvOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false,
    starttag: local ? '<!-- inject:devenv:js -->' : '<!-- inject:env:js -->'
  };

  var injectScripts = gulp.src([
    path.join(conf.paths.src, '/app/**/*.module.js'),
    path.join(conf.paths.src, '/app/**/*.js'),
    path.join('!' + conf.paths.src, '/app/**/env.js'),
    path.join('!' + conf.paths.src, '/app/**/devenv.js'),
    path.join('!' + conf.paths.src, '/app/**/*.spec.js'),
    path.join('!' + conf.paths.src, '/app/**/*.mock.js'),
  ])
  .pipe($.sort()).on('error', conf.errorHandler('AngularFilesort'));

  var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };

  return gulp.src([path.join(conf.paths.src, '/*.html'), path.join(conf.paths.src, '/*.scss')])
  	.pipe($.if(!local, $.stripCode(conf.stripCodePattern("start spa css", "end spa css") )))
  	.pipe($.if(local, $.stripCode(conf.stripCodePattern("start mvc css", "end mvc css") )))
  	.pipe($.if(local, $.stripCode(conf.stripCodePattern("start base href", "end base href") )))
  	.pipe($.if(local, $.stripCode(conf.stripCodePattern("start menu bar", "end menu bar") )))
    .pipe($.if(local, $.stripCode(conf.stripCodePattern("start release env", "end release env") )))
    .pipe($.if(!local, $.stripCode(conf.stripCodePattern("start dev env", "end dev env") )))

    .pipe($.inject(injectStyles, injectStylesOptions))
    .pipe($.inject(injectEnviormentScript, injectEnvOptions))
    .pipe($.inject(injectScripts, injectOptions))
 
    .pipe(wiredep(_.extend({}, getWiredepOptions()))).on('error', conf.errorHandler('wiredep'))
    // .pipe($.replace(/<ov-app-loading>/, function(s){
    //     return fs.readFileSync(path.join(conf.paths.src, '/app/components/loading/loading.htm'), 'utf8');
    // }))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});
