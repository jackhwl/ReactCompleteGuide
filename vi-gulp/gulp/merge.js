
'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del', 'minimist']
});

// Parse the arguments to check for 'release'
var argv = $.minimist(process.argv.slice(2));
var release = (argv._.indexOf('release') == -1 ? false : true);
var local = (argv._.indexOf('local') == -1 ? false : true);

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,otf,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest(path.join(conf.paths.dist, local ? '/fonts' : '/fonts')));
});

gulp.task('copyfonts', function() {
   gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
   .pipe(gulp.dest(path.join(conf.paths.dist, local ? '/fonts' : '/fonts')));
   gulp.src('./bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
   .pipe(gulp.dest(path.join(conf.paths.dist, local ? '/fonts' : '/fonts')));
   gulp.src(path.join(conf.paths.src, '/app/fonts/**/*'))
   .pipe(gulp.dest(path.join(conf.paths.dist, local ? '/fonts' : '/fonts')));
});

gulp.task('copyimages', function() {
   gulp.src(path.join(conf.paths.src, '/app/images/*'))
   .pipe(gulp.dest(path.join(conf.paths.dist, local ? '/images' : '/images')));
});

//gulp.task('movestyles', ['html'], function() {
//	if (!local) {
//	   gulp.src(path.join(conf.paths.dist, '/styles/*'))
//	   .pipe(gulp.dest(path.join(conf.paths.dist, '/styles')));
//	   $.del([path.join(conf.paths.dist, '/styles')]);
//	}
//});

gulp.task('testC', function () {

    return gulp.src([path.join(conf.paths.mvc, '/Views/Home/Dashboard.cshtml')])
         .pipe($.tfsCheckout({credential: "-login:192.168.2.155\\\"Jack Huang\",password"}));
});

gulp.task('checkoutSpa', function () {
    return gulp.src([path.join(conf.paths.mvc, '/Views/Spa/index.cshtml'),
					 path.join(conf.paths.mvc, '/scripts/app.js'),
					 path.join(conf.paths.mvc, '/scripts/vendor.js'),
					 path.join(conf.paths.mvc, '/scripts/env.js'),
					 path.join(conf.paths.mvc, '/styles/app.css'),
					 path.join(conf.paths.mvc, '/styles/vendor.css')
					])
         .pipe($.tfsCheckout({credential: "-login:192.168.2.155\\\"Jack Huang\",password"})).on('error', conf.errorHandler('tfsCheckout'));
});
/*
gulp.task('tfs', ['checkoutSpa'], function() {
		
	   //gulp.src([path.join(conf.paths.mvc, '/Views/Home')+'/Dashboard.cshtml'])
	   //.pipe($.tfsCheckout());
	
	   gulp.src(path.join(conf.paths.dist, '/scripts/app.js'))
	   .pipe($.rename('notification-bar.js'))
	   .pipe($.header('\ufeff'))
	   .pipe(gulp.dest(path.join(conf.paths.mvc, '/scripts'))).on('error', conf.errorHandler('dashboard'));
});
*/

// Don't need checkout since we're switch to Git
//gulp.task('copy2mvc', ['html', 'checkoutSpa'], function() {
gulp.task('deleteOldBundle', [], function(){
   $.del([path.join(conf.paths.mvc, '/scripts/app*.js')
   		, path.join(conf.paths.mvc, '/scripts/env*.js')
   		, path.join(conf.paths.mvc, '/scripts/vendor*.js')
   		, path.join(conf.paths.mvc, '/styles/app*.css')
   		, path.join(conf.paths.mvc, '/styles/vendor*.css')
   		]);
});

gulp.task('copy2mvc', ['html', 'deleteOldBundle'], function() {
	if (!local) {
	   gulp.src(path.join(conf.paths.dist, '/index.html'))
	   .pipe($.rename('index.cshtml'))
	   .pipe($.header('\ufeff'))
	   .pipe(gulp.dest(path.join(conf.paths.mvc, '/Views/Spa')));
	   gulp.src(path.join(conf.paths.dist, '/scripts/app*.js'))
	   .pipe($.header('\ufeff'))
	   .pipe(gulp.dest(path.join(conf.paths.mvc, '/scripts')));

	   gulp.src(path.join(conf.paths.dist, '/scripts/vendor*.js'))
	   .pipe($.header('\ufeff'))
	   .pipe(gulp.dest(path.join(conf.paths.mvc, '/scripts')));

	   gulp.src(path.join(conf.paths.dist, '/scripts/env*.js'))
	   .pipe($.header('\ufeff'))
	   .pipe(gulp.dest(path.join(conf.paths.mvc, '/scripts')));
	   
	   gulp.src(path.join(conf.paths.dist, '/styles/app*.css'))
	   .pipe($.header('\ufeff'))
	   .pipe(gulp.dest(path.join(conf.paths.mvc, '/styles')));
	   gulp.src(path.join(conf.paths.dist, '/styles/vendor*.css'))
	   .pipe($.header('\ufeff'))
	   .pipe(gulp.dest(path.join(conf.paths.mvc, '/styles')));

	   gulp.src(path.join(conf.paths.dist, '/scripts/*.map'))
	   .pipe($.header('\ufeff'))
	   .pipe(gulp.dest(path.join(conf.paths.mvc, '/scripts')));
	   gulp.src(path.join(conf.paths.dist, '/styles/*.map'))
	   .pipe($.header('\ufeff'))
	   .pipe(gulp.dest(path.join(conf.paths.mvc, '/styles')));
	}
});

gulp.task('merge', [], function () {
	if (local) {
		gulp.start('fonts');	
		gulp.start('copyfonts');	
		gulp.start('copyimages');	
	}
	else {
		//gulp.start('copy2mvc');	
	}
//  var fileFilter = $.filter(function (file) {
//    return file.stat.isFile();
//  });
//
//  return gulp.src([
//    path.join(conf.paths.src, '/**/*'),
//    path.join('!' + conf.paths.src, '/**/*.{html,css,js}')
//  ])
//    .pipe(fileFilter)
//    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
	
});