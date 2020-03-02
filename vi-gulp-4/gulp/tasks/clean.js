// =========================================================
// Gulp Task: clean
// Description: deletes dist folder
// npm install --save-del del gulp-load-plugins
// =========================================================

var gulp = require('gulp')
var path = require('path')
var conf = require('../conf')

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
})

module.exports = function() {
    return function (cb) {
        var stream = 
        // -------------------------------------------- Start Task
            // del(config.clean.folders, cb);
            $.del([path.join(conf.paths.dist, '/')
                    , path.join(conf.paths.tmp, '/')
                ], cb)
            //$.del('./dist/', cb);
        // ---------------------------------------------- End Task
        return stream
    }
}