var path = require("path")
var conf = require("../conf")
var config = require("../config")
var gulp = require("gulp")
var wiredep = require("wiredep").stream

var $ = require("gulp-load-plugins")({
  pattern: ["gulp-*", "minimist"]
})

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
        .pipe($.if(conf.userev, $.rev()))
        //.pipe(gulp.dest(path.join(conf.paths.dist, "/")))
        .pipe($.if(release, $.sourcemaps.init({ loadMaps: true })))
        .pipe($.sass())
        .pipe($.if(release, $.sourcemaps.write(".")))
        // comment below to generate file
        .pipe(
          $.if(
            conf.userev,
            $.rev.manifest("rev-manifest.json", {
              //base: ".",
              merge: true
            })
          )
        )
        // .pipe(gulp.dest(path.join(conf.paths.dist, "/")))
        .pipe(gulp.dest(path.join(conf.paths.tmp, "/serve")))
    //.pipe(gulp.dest(conf.paths.tmp, "/serve"))
    // ---------------------------------------------- End Task
    return stream
  }
}
