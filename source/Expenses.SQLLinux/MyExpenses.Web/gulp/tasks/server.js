'use strict';

var webserver = require('gulp-webserver');
var eslint = require('gulp-eslint');
var server = require( 'gulp-develop-server');

module.exports = function (gulp, paths) {

    gulp.task('server:client', function (done) {
        return gulp.src('./')
            .pipe(webserver({
                livereload: true,
                open: 'client/dist/#/'
            }));
    });

    gulp.task('server:node', function (done) {
        return server.listen( { path: './server.js' } );
    });

    gulp.task('server:lint', function () {
        return gulp.src(paths.debug.server.js.files)
                .pipe(eslint({
                    config: './eslint.json'
                }))
                .pipe(eslint.format())
                .pipe(eslint.failAfterError());
    });

    gulp.task('server:watch', function () {
        gulp.watch([paths.debug.server.js.files], ['server']);
        gulp.watch([paths.debug.server.js.files], server.restart);
    });

}
