/// <binding BeforeBuild='default' />
'use strict';

var gulp = require('gulp');
var paths = require('./gulp/paths');
var runSequence = require('run-sequence');

require('./gulp/tasks/app')(gulp, paths);
require('./gulp/tasks/clean')(gulp, paths);
require('./gulp/tasks/libs')(gulp, paths);
require('./gulp/tasks/server')(gulp, paths);

gulp.task('client', function () {
    runSequence('clean:debug',
                'libs:debug:js',
                'libs:debug:css',
                'app:debug:js',
                'app:debug:less',
                'app:debug:tpls',
                'app:debug:copy',
                'app:debug:inject');
});

gulp.task('client:release', function() {
    runSequence('libs:debug:js',
                'libs:debug:css',
                'app:debug:js',
                'app:debug:less',
                'app:debug:tpls',
                'app:debug:copy',
                'libs:release:js',
                'app:release:js',
                'clean:release',
                'app:release:inject');
});

gulp.task('client:dev', function() {
    runSequence('clean:debug',
                'libs:debug:js',
                'libs:debug:css',
                'app:debug:js',
                'app:debug:less',
                'app:debug:tpls',
                'app:debug:copy',
                'app:debug:inject',
                'server:client',
                'app:watch');
});

gulp.task('server', function () {
    runSequence('server:lint');
});

gulp.task('server:dev', function () {
    runSequence('server:lint',
                'server:watch', 
                'server:node');
});

gulp.task('default', ['client', 'server']);
gulp.task('release', ['client:release', 'server']);