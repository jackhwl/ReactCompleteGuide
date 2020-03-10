var path = require("path")
var gulp = require("gulp")
var conf = require("../conf")

var $ = require("gulp-load-plugins")({
  pattern: [
    "gulp-*",
    "main-bower-files",
    "uglify-save-license",
    "del",
    "minimist",
    "lazypipe"
  ]
})

// Parse the arguments to check for 'release'
var argv = $.minimist(process.argv.slice(2))
var release = argv._.indexOf("release") == -1 ? false : true

//gulp.task("html", ["inject", "partials"], function() {
// var partialsInjectFile = gulp.src(
//   path.join(conf.paths.tmp, conf.paths.partials, conf.files.templateCacheHtml),
//   { read: false }
// )
// var partialsInjectOptions = {
//   starttag: "<!-- inject:partials -->",
//   ignorePath: path.join(conf.paths.tmp, conf.paths.partials),
//   addRootSlash: false
// }

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
  return function(file) {
    //$.util.log(file.path)
    var fileData = path.parse(file.path),
      fileExt = fileData.ext.replace(".", ""),
      minRegexp = new RegExp(".min$")

    return !!(fileExt === type && !minRegexp.test(fileData.name))
  }
}
module.exports = function() {
  var htmlFilter = $.filter(["**/index.html"], { restore: true })
  //var manifestFilter = $.filter("**/manifest.json", { restore: true })
  var vendorJsFilter = $.filter("**/vendor.js", { restore: true })
  var appJsFilter = $.filter("**/app.js", { restore: true })
  var envJsFilter = $.filter("**/env.js", { restore: true })
  var cssFilter = $.filter(["*", "!**/*.js"], { restore: true })
  var scssFilter = $.filter("**/*.scss", { restore: true })
  return function() {
    // prettier-ignore
    var stream =
      // -------------------------------------------- Start Task
      gulp.src([path.join(conf.paths.tmp, '/dist/src/index.html'), 
                   path.join(conf.paths.tmp, '/**/*.css'),
                  //  path.join(conf.paths.tmp, '/scripts/*.js')
                ])
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
  //.pipe($.size({title: 'before ========= useref ', showFiles: true }))
  .pipe($.useref({}, $.lazypipe()
                        .pipe(function() {
      // return $.if(minCondition('js'), 
      //   $.size({title: path.join(conf.paths.partials, '/'), showFiles: true }), 
      //   $.size({title: path.join(conf.paths.dist, '/'), showFiles: true }));
      return $.if(minCondition('js'), $.if(release, $.uglify({output: {comments: $.uglifySaveLicense }})));
    })))
    //.pipe($.if(release, $.if(/\.css$/,$.size({title: 'after ----- useref ', showFiles: true }))))
    .pipe($.if(release, $.if(/(videsktop|vendor|app)\.css$/,$.cssnano())))
    //.pipe($.filter('**/*.css'))
    //.pipe($.if(release, $.cssnano()))
    // .pipe(cssFilter)
    // .pipe($.size({title: 'after -----1------- cssFilter ', showFiles: true }))
    // .pipe(cssFilter.restore)
    //.pipe($.size({title: 'after ----- useref ', showFiles: true }))
    //.pipe($.size({title: 'before vendor filter', showFiles: true }))
    .pipe($.if(conf.userev, $.if(/((vendor|app)\.js|(videsktop|vendor|app)\.css)$/, $.rev())))
    // .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    // .pipe($.if(conf.userev, $.rev.manifest('rev-manifest.json', {merge: true})))
    // .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.if(release, $.sourcemaps.init({loadMaps: true})))
    .pipe($.if(release, $.sourcemaps.write('.')))
    // .pipe(scssFilter)
    //.pipe($.if(conf.userev, $.rev()))
    // .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    // .pipe($.if(conf.userev, $.rev.manifest('rev-manifest.json', {merge: true})))
    // .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    //.pipe(scssFilter.restore)

    //.pipe($.if(release, $.sourcemaps.init()))

    // .pipe(vendorJsFilter)
    // .pipe($.size({title: 'after ------------ vendor filter', showFiles: true }))
    // .pipe($.if(release, $.sourcemaps.init()))
    // //.pipe($.ngAnnotate())
    // //.pipe($.if(release, $.uglify({ mangle: false, compress: false, preserveComments: `license` }))).on('error', conf.errorHandler('Uglify'))
    // //.pipe($.if(release, $.uglify({ output: {comments: $.uglifySaveLicense  }}))).on('error', conf.errorHandler('Uglify'))
    
    // .pipe($.if(conf.userev, $.rev()))
    // // .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    // // .pipe($.if(conf.userev, $.rev.manifest('rev-manifest.json', {merge: true})))
    // // .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    // .pipe($.if(release, $.sourcemaps.write('.')))
    // .pipe(vendorJsFilter.restore)

    // .pipe(appJsFilter)
    // //.pipe($.if(release, $.sourcemaps.init()))
    // .pipe($.if(release, $.uglify())) //.on('error', conf.errorHandler('Uglify'))
    // // .pipe($.if(conf.userev, $.rev()))
    // // .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    // //.pipe($.if(conf.userev, $.rev.manifest('dist/rev-manifest.json', {base: process.cwd() + '/dist', merge: true})))
    // //.pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    // // , {
    // //   sourceMappingURL: function(file) {
    // //     return 'https://asset-host.example.com/' + file.relative + '.map';
    // //   }})
      
    // //.pipe(gulp.dest(path.join(conf.paths.dist)))
    // //.pipe($.if(release, $.sourcemaps.write('.')))
    // .pipe(appJsFilter.restore)
    // //.pipe($.if(release, $.sourcemaps.write('.')))
    
    // .pipe(envJsFilter)
    // .pipe($.if(release, $.uglify({ output: {comments: $.uglifySaveLicense  }}))).on('error', conf.errorHandler('Uglify'))
    // // .pipe($.if(conf.userev, $.rev()))
    // // .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    // // .pipe($.if(conf.userev, $.rev.manifest('dist/rev-manifest.json', {base: process.cwd() + '/dist', merge: true})))
    // // .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    // .pipe(envJsFilter.restore)

    // .pipe(scssFilter)
    // .pipe($.size({title: 'after ------------ scssFilter ', showFiles: true }))
    // //.pipe($.if(release, $.sourcemaps.init()))
    // .pipe($.if(release, $.cssnano()))
    // // .pipe($.if(conf.userev, $.rev()))
    // //.pipe($.if(release, $.sourcemaps.write('.')))
    // .pipe(scssFilter.restore)

    // .pipe(cssFilter)
    // .pipe($.size({title: 'after ------------ cssFilter ', showFiles: true }))
    // //.pipe($.if(release, $.sourcemaps.init()))
    // //.pipe($.if(release, $.cssnano()))
    // // .pipe($.if(conf.userev, $.rev()))
    // // .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    // // .pipe($.if(conf.userev, $.rev.manifest('dist/rev-manifest.json', {base: process.cwd() + '/dist', merge: true})))
    // // .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    // //.pipe($.if(release, $.sourcemaps.write('.')))
    // .pipe(cssFilter.restore)
    
    // .pipe(htmlFilter)
    // //.pipe($.if(conf.userev, $.rev()))
    // // .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    // // .pipe($.if(conf.userev, $.rev.manifest('rev-manifest.json', {merge: true})))
    // // .pipe(gulp.dest(path.join(conf.paths.dist, '/')))

    // .pipe($.if(release, $.htmlmin({
    //   removeEmptyAttributes: true,
    //   removeAttributeQuotes: true,
    //   removeComments: true,
    //   collapseBooleanAttributes: true,
    //   collapseWhitespace: true
    // })))
    // .pipe(htmlFilter.restore)
    // //.pipe($.if(conf.userev, $.revReplace({manifest: gulp.src(path.join(conf.paths.dist, '/rev-manifest.json')) })))
    // // .pipe($.filerevReplace({
    // //   filerev: ['scripts/vendor.js'], // Select the files to filerev
    // //   replace: [path.join(conf.paths.dist, '/**/*')],  // Select the files to replace
    // //   base:    'scripts'         // Filerevved files are served from the assets directory by the web server
    // // }))
    // // .pipe($.filerevReplace.addManifest({path: path.join(conf.paths.dist, '/filerev.json')}))
    // //.pipe($.flatten({ subPath: [0, 1]}))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe(
      $.if(
        conf.userev,
        $.rev.manifest("rev-manifest.json", {
          base: '.',
          merge: true
        })
      )
    )
    .pipe(gulp.dest(path.join(conf.paths.dist, "/")))
    .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));

    // ---------------------------------------------- End Task
    return stream
  }
}
