var path = require("path")
var conf = require("../conf")
var config = require("../config")
var gulp = require("gulp")
var wiredep = require("wiredep").stream

var $ = require("gulp-load-plugins")({
  pattern: ["gulp-*", "minimist"]
})
var videsktopScssFilter = $.filter("**/sass/videsktop.scss", { restore: true })
var appScssFilter = $.filter("**/vendor-list.scss", { restore: true })

$.sass.compiler = require("dart-sass")

var argv = $.minimist(process.argv.slice(2))
var release = argv._.indexOf("release") == -1 ? false : true

module.exports = function() {
  return function() {
    var stream =
      // -------------------------------------------- Start Task
      gulp
        .src([
          path.join(conf.paths.src, "*.scss"),
          path.join(conf.paths.src, "sass/videsktop.scss")
        ])
        .pipe(wiredep(Object.assign({}, config.wiredepOptions(release))))
        .on("error", conf.errorHandler("wiredep"))
        .pipe(videsktopScssFilter)
        .pipe($.if(release, $.sourcemaps.init({ loadMaps: true })))
        .pipe($.sass({ outputStyle: "compressed", sourceMap: true }))
        //.pipe($.if(conf.userev, $.rev()))
        .pipe($.if(release, $.sourcemaps.write(".")))
        //.pipe($.flatten({ subPath: [1, 2] }))
        .pipe(gulp.dest(path.join(conf.paths.tmp, "dist")))
        // .pipe(
        //   $.if(
        //     conf.userev,
        //     $.rev.manifest("rev2-manifest.json", {
        //       base: ".",
        //       merge: true
        //     })
        //   )
        // )
        //.pipe($.if(release, $.cssnano()))
        //.pipe(gulp.dest(path.join(conf.paths.dist, "/")))
        .pipe(videsktopScssFilter.restore)
        .pipe(appScssFilter)
        //.pipe($.if(release, $.sourcemaps.init({ loadMaps: true })))
        .pipe($.sass({ outputStyle: "compressed" }))
        //.pipe($.if(release, $.cssnano()))
        //.pipe($.if(release, $.sourcemaps.write(".")))
        .pipe(gulp.dest(path.join(conf.paths.tmp, "dist")))
        .pipe(appScssFilter.restore)

    //.pipe(gulp.dest(conf.paths.tmp, "/serve"))
    // ---------------------------------------------- End Task
    return stream
  }
}
