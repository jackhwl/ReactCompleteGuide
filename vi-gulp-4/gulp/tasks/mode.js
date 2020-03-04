var $ = require("gulp-load-plugins")({
  pattern: ["gulp-*", "minimist"]
})

var argv = $.minimist(process.argv.slice(2))
var release = argv._.indexOf("release") == -1 ? false : true

module.exports = function() {
  return function(cb) {
    //var stream = $.util.noop()
    // -------------------------------------------- Start Task
    if (release) {
      $.util.log($.util.colors.red("RUNNING IN RELEASE MODE"))
    } else {
      $.util.log($.util.colors.green("RUNNING IN DEBUG MODE"))
    }
    cb()
    // ---------------------------------------------- End Task
    //return stream
  }
}
