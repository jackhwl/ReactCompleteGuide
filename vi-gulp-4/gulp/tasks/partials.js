"use strict"

var path = require("path")
var gulp = require("gulp")
var conf = require("../conf")

var $ = require("gulp-load-plugins")({
  pattern: ["gulp-*", "minimist"]
})

// Parse the arguments to check for 'release'
var argv = $.minimist(process.argv.slice(2))
var release = argv._.indexOf("release") == -1 ? false : true
var debug = argv._.indexOf("debug") == -1 ? false : true

// prettier-ignore
module.exports = function() {
  return function() {
    // prettier-ignore
    var stream =
      // -------------------------------------------- Start Task
    gulp.src([
		path.join(conf.paths.src, '/app/**/*.html')
		//path.join(conf.paths.tmp, '/serve/app/**/*.html')
	  ])
  	// .pipe($.if(debug, $.stripCode(conf.stripCodePattern("start mvc view image", "end mvc view image") )))
  	// .pipe($.if(!debug, $.stripCode(conf.stripCodePattern("start spa view image", "end spa view image") )))
    .pipe($.if(release, $.stripCode(conf.stripCodePattern("start debug home menu", "end debug home menu") )))
    .pipe($.if(debug, $.stripCode(conf.stripCodePattern("start release home menu", "end release home menu") )))
    .pipe($.if(release, $.htmlmin({
      removeEmptyAttributes: true,
      removeAttributeQuotes: true,
      collapseBooleanAttributes: true,
      collapseWhitespace: true
    })))
    // .pipe($.angularTemplatecache(conf.files.templateCacheHtml, {
    //   module: 'app',
    //   root: 'app'
    // }))
    .pipe(gulp.dest(path.join(conf.paths.tmp, conf.paths.partials)));
        // ---------------------------------------------- End Task
    return stream
  }
}
