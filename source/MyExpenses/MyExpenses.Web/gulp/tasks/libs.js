'use strict';

var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');

module.exports = function (gulp, paths) {

    gulp.task('libs:debug:js', function() {
        return gulp.src(paths.libs.js)
            .pipe(gulp.dest(paths.debug.js.vendor.folder));
    });

    gulp.task('libs:debug:css', function() {
        return gulp.src(paths.libs.css)
            .pipe(concat('vendor.css', { newLine: ';' }))
            .pipe(cleanCSS())
            .pipe(gulp.dest(paths.debug.less.dist.folder));
    });

    gulp.task('libs:release:js', function () {
        return gulp.src(paths.debug.js.vendor.files)
            .pipe(concat('vendor.min.js', { newLine: ';' }))
            .pipe(uglify())
            .pipe(gulp.dest(paths.release.dist.folder));
    });
}