// =========================================================
// Gulp Task: clean
// Description: deletes dist folder
// npm install --save-del del gulp-load-plugins
// =========================================================

var conf = require("../conf")

var $ = require("gulp-load-plugins")({
  pattern: ["gulp-*", "del"]
})

module.exports = function() {
  return function(cb) {
    var stream =
      // -------------------------------------------- Start Task
      //$.del(config.clean.folders, cb)
      $.del([conf.paths.dist, conf.paths.tmp], cb)
    // ---------------------------------------------- End Task
    return stream
  }
}
