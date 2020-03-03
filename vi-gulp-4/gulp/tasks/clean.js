// =========================================================
// Gulp Task: clean
// Description: deletes dist folder
// npm install --save-del del gulp-load-plugins
// =========================================================

var gulp = require('gulp')
var config = require('../config')

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
})

module.exports = function() {
    return function (cb) {
        var stream = 
        // -------------------------------------------- Start Task
            $.del(config.clean.folders, cb)
        // ---------------------------------------------- End Task
        return stream
    }
}