var path = require("path")
var conf = require("../conf")
var config = require("../config")
var gulp = require("gulp")
var wiredep = require("wiredep").stream

var $ = require("gulp-load-plugins")({
  pattern: ["gulp-*", "minimist"]
})

var argv = $.minimist(process.argv.slice(2))
var debug = argv._.indexOf("debug") == -1 ? false : true

var injectStyles = gulp.src(
  [
    path.join(conf.paths.src, "/app/**/*.css")
    //path.join(conf.paths.tmp, '/serve/**/*.css')
    //path.join(conf.paths.tmp, '/serve/**/*.scss')
  ],
  {
    read: false
  }
)

var injectStylesOptions = {
  ignorePath: [conf.paths.src, path.join(conf.paths.tmp, "/serve")],
  addRootSlash: false
}

var injectEnviormentScript = gulp.src([
  path.join(
    conf.paths.src,
    "/app/**/",
    debug ? conf.files.devenv : conf.files.env
  )
])

var injectEnvOptions = {
  ignorePath: [conf.paths.src, path.join(conf.paths.tmp, "/serve")],
  addRootSlash: false,
  starttag: debug ? "<!-- inject:devenv:js -->" : "<!-- inject:env:js -->"
}

var injectScripts = gulp
  .src([
    path.join(conf.paths.src, "/app/**/*.module.js"),
    path.join(conf.paths.src, "/app/**/*.js"),
    path.join("!" + conf.paths.src, "/app/**/env.js"),
    path.join("!" + conf.paths.src, "/app/**/devenv.js"),
    path.join("!" + conf.paths.src, "/app/**/*.spec.js"),
    path.join("!" + conf.paths.src, "/app/**/*.mock.js")
  ])
  .pipe($.sort())
  .on("error", conf.errorHandler("AngularFilesort"))

var injectOptions = {
  ignorePath: [conf.paths.src, path.join(conf.paths.tmp, "/serve")],
  addRootSlash: false
}

module.exports = function() {
  return function() {
    // prettier-ignore
    var stream =
      // -------------------------------------------- Start Task
      gulp
        .src([
          path.join(conf.paths.src, "/*.html"),
          path.join(conf.paths.src, "/*.scss")
        ])
        .pipe($.if(!debug, $.stripCode(conf.stripCodePattern("start spa css", "end spa css"))))
        .pipe($.if(debug, $.stripCode(conf.stripCodePattern("start mvc css", "end mvc css"))))
        .pipe($.if(debug, $.stripCode(conf.stripCodePattern("start base href", "end base href"))))
        .pipe($.if(debug, $.stripCode(conf.stripCodePattern("start menu bar", "end menu bar"))))
        .pipe($.if(debug, $.stripCode(conf.stripCodePattern("start release env", "end release env"))))
        .pipe($.if(!debug, $.stripCode(conf.stripCodePattern("start dev env", "end dev env"))))
        .pipe($.inject(injectStyles, injectStylesOptions))
        .pipe($.inject(injectEnviormentScript, injectEnvOptions))
        .pipe($.inject(injectScripts, injectOptions))

        .pipe(wiredep(Object.assign({}, config.wiredepOptions(!debug))))
        .on("error", conf.errorHandler("wiredep"))
        // .pipe($.replace(/<ov-app-loading>/, function(s){
        //     return fs.readFileSync(path.join(conf.paths.src, '/app/components/loading/loading.htm'), 'utf8');
        // }))
        .pipe(gulp.dest(path.join(conf.paths.tmp, "/serve")))
    // ---------------------------------------------- End Task
    return stream
  }
}
