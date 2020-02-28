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
  var scssFilter = $.filter('**/*.scss', { restore: true });


  // gulp.task('compile', function () {
  //   return gulp.src('index.html')
  //       .pipe($.useref({}, $.lazypipe().pipe(function() {
  //           return $.if(['**/*.js', '!**/*.min.js'], $.uglify());
  //       })))
  //       //.pipe(gulp.dest(paths.build));

  //       .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
  //       .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
  // });
  
  function minCondition(type) {
    return function (file) {
        var fileData = path.parse(file.path),
            fileExt = fileData.ext.replace('.', ''),
            minRegexp = new RegExp('\.min$');

        return !!(fileExt === type && !minRegexp.test(fileData.name));
    }
  }

  return gulp.src([path.join(conf.paths.tmp, '/serve/*.html'), 
                  path.join(conf.paths.tmp, '/serve/*.scss')])
    // .pipe($.inject(partialsInjectFile, partialsInjectOptions))
  //  .pipe(scssFilter)
  //  .pipe($.sass())
  //  .pipe(scssFilter.restore)
  //  .pipe($.rename({
  //       extname: ".css"
  //   }))
  // .pipe($.useref())

  //  .pipe($.if('*.scss', 
  //                 $.size({title: path.join(conf.paths.partials, '/'), showFiles: true }), 
  //                 $.size({title: path.join(conf.paths.dist, '/'), showFiles: true })))
    .pipe($.useref({}, $.lazypipe().pipe(function() {
      // return $.if(minCondition('js'), 
      //   $.size({title: path.join(conf.paths.partials, '/'), showFiles: true }), 
      //   $.size({title: path.join(conf.paths.dist, '/'), showFiles: true }));
      return $.if(minCondition('js'), $.if(release, $.uglify({ preserveComments: $.uglifySaveLicense })), $.nop());
    })))
    .pipe(vendorJsFilter)
    .pipe($.if(release, $.sourcemaps.init()))
    //.pipe($.ngAnnotate())
    //.pipe($.if(release, $.uglify({ mangle: false, compress: false, preserveComments: `license` }))).on('error', conf.errorHandler('Uglify'))
    //.pipe($.if(release, $.uglify({ preserveComments: $.uglifySaveLicense }))).on('error', conf.errorHandler('Uglify'))
    .pipe($.if(conf.userev, $.rev()))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.if(conf.userev, $.rev.manifest('dist/rev-manifest.json', {base: process.cwd() + '/dist', merge: true})))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.if(release, $.sourcemaps.write('.')))
    .pipe(vendorJsFilter.restore)
    .pipe(appJsFilter)
    .pipe($.if(release, $.sourcemaps.init()))
    .pipe($.if(release, $.uglify({ preserveComments: $.uglifySaveLicense }))).on('error', conf.errorHandler('Uglify'))
    .pipe($.if(conf.userev, $.rev()))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.if(conf.userev, $.rev.manifest('dist/rev-manifest.json', {base: process.cwd() + '/dist', merge: true})))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.if(release, $.sourcemaps.write('.')))
    .pipe(appJsFilter.restore)
    .pipe(envJsFilter)
    .pipe($.if(release, $.uglify({ preserveComments: $.uglifySaveLicense }))).on('error', conf.errorHandler('Uglify'))
    .pipe($.if(conf.userev, $.rev()))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.if(conf.userev, $.rev.manifest('dist/rev-manifest.json', {base: process.cwd() + '/dist', merge: true})))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe(envJsFilter.restore)
    .pipe(scssFilter)
    .pipe($.if(release, $.sourcemaps.init()))
    .pipe($.if(release, $.cssnano()))
    .pipe($.if(conf.userev, $.rev()))
    .pipe($.if(release, $.sourcemaps.write('.')))
    .pipe(scssFilter.restore)
    .pipe(cssFilter)
    .pipe($.if(release, $.sourcemaps.init()))
    .pipe($.if(release, $.cssnano()))
    .pipe($.if(conf.userev, $.rev()))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.if(conf.userev, $.rev.manifest('dist/rev-manifest.json', {base: process.cwd() + '/dist', merge: true})))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
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
    // .pipe($.filerevReplace({
    //   filerev: ['scripts/vendor.js'], // Select the files to filerev
    //   replace: [path.join(conf.paths.dist, '/**/*')],  // Select the files to replace
    //   base:    'scripts'         // Filerevved files are served from the assets directory by the web server
    // }))
    // .pipe($.filerevReplace.addManifest({path: path.join(conf.paths.dist, '/filerev.json')}))
  
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
  });

