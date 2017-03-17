'use strict';

var concat = require('gulp-concat');
var inject = require('gulp-inject');
var less = require('gulp-less');
var ngAnnotate = require('gulp-ng-annotate');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var templateCache = require('gulp-angular-templatecache');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');

var injectConfig = {
    transform: function(name) {
        return inject.transform.html.js(name.replace('/client/dist/', ''));
    }
};

module.exports = function (gulp, paths) {

    gulp.task('app:debug:js', function () {
        return gulp.src(paths.debug.js.src.files)
            .pipe(gulp.dest(paths.debug.js.dist.folder));
    });

    gulp.task('app:debug:less', function () {
        return gulp.src(paths.debug.less.src.files)
            .pipe(concat('app.less', { newLine: ';' }))
            .pipe(less())
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            .pipe(cleanCSS())
            .pipe(gulp.dest(paths.debug.less.dist.folder));
    });

    gulp.task('app:debug:tpls', function () {
        return gulp.src(paths.debug.templates.src)
            .pipe(templateCache('dist-tpls.js', { module: 'app.templates', standalone: true }))
            .pipe(gulp.dest(paths.debug.templates.dist.folder));
    });

    gulp.task('app:debug:inject', function () {      
        return gulp.src(paths.debug.index)
            .pipe(
                inject(
                    gulp.src(
                        paths.debug.js.dist.files
                        .concat(paths.debug.templates.dist.files
                    ), 
                    {read: false}
                ),
                injectConfig)
             )
            .pipe(gulp.dest(paths.release.dist.folder));
    });

    gulp.task('app:debug:copy', function () {
        //Images
        gulp.src(paths.debug.images.src)
            .pipe(gulp.dest(paths.debug.images.dist));

        // Fonts
        return gulp.src(paths.debug.fonts.src)
            .pipe(gulp.dest(paths.debug.fonts.dist));
    });

    gulp.task('app:release:js', function () {
        return gulp.src(paths.debug.js.dist.files)
            .pipe(concat('app.min.js', { newLine: ';' }))
            .pipe(ngAnnotate())
            .pipe(uglify())
            .pipe(gulp.dest(paths.release.dist.folder));
    });

    gulp.task('app:release:inject', function () {
        
        return gulp.src(paths.debug.index)
            .pipe(
                inject(
                    gulp.src(paths.release.js, { read: false }),
                    injectConfig
                )
            )
            .pipe(gulp.dest(paths.release.dist.folder));
    });

    gulp.task('app:watch', function () {
        gulp.watch([paths.debug.js.src.files,
                    paths.debug.less.src.files,
                    paths.debug.templates.src], ['client']);
    });
}