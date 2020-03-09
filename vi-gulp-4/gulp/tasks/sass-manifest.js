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
        .pipe($.if(release, $.sourcemaps.init({ loadMaps: true })))
        .pipe($.sass())
        .pipe($.if(release, $.sourcemaps.write(".")))
        .pipe($.flatten())
        .pipe(gulp.dest(path.join(conf.paths.dist, "/styles")))
        .pipe(
          $.if(
            conf.userev,
            $.rev.manifest("rev2-manifest.json", {
              merge: true
            })
          )
        )
        .pipe(gulp.dest(path.join(conf.paths.dist, "/")))
    //.pipe(gulp.dest(conf.paths.tmp, "/serve"))
    // ---------------------------------------------- End Task
    return stream
  }
}
