const gulp = require('gulp');
const runSequence = require('run-sequence');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();

gulp.task('serve', ['preprocessor-watch'], $.shell.task(['ng serve --target=development']));

gulp.task('prebuild', ['preprocessor'], $.shell.task(['ng build --target=development']));

gulp.task('preprod', ['preprocessor'], $.shell.task(['ng build --target=production']));

var copyWebConfig = function() {
    return gulp.src('./web.config')
        .pipe(gulp.dest('./dist'));
};

gulp.task('build', ['prebuild'], copyWebConfig);

gulp.task('prod', ['preprod'], copyWebConfig);

gulp.task('createIconsFont', function(){

    var runTimestamp = Math.round(Date.now()/1000);

    return gulp.src('src/icons/**/*.svg')
        .pipe($.iconfont({
            fontName: 'icons',
            normalize: true,
            prependUnicode: false,
            formats: ['woff'],
            timestamp: runTimestamp,
        }))
        .on('glyphs', function(glyphs, options) {
            gulp.src('utils/icons_template.css')
                .pipe($.consolidate('lodash', {
                    glyphs: glyphs,
                    fontName: 'icons',
                    fontPath: 'src/icons/',
                    className: 'icon'
                }))
                .pipe($.rename('_icons.scss'))
                .pipe(gulp.dest('src/styles'));
        })
        .pipe(gulp.dest('src/icons'));
});

gulp.task('icons', ['createIconsFont'], function(){
    return gulp.src('src/icons/icons.woff')
        .pipe($.inlineFonts({
            name: 'icons',
            style: 'normal',
            weight: 'normal',
            formats: ['woff']
        }))
        .pipe($.rename('_fonts.scss'))
        .pipe(gulp.dest('src/styles'));
});

gulp.task('styles', function(){
    return gulp.src(['src/**/*.scss'])
        .pipe($.sassLint({
            configFile: '.sassLint.yml',
            formatter: 'checkstyle',
            files: {ignore: 'src/styles/_fonts.scss'},
        }))
        .pipe($.sassLint.format())
        .pipe($.sassLint.failOnError())
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.autoprefixer(['last 2 version']))
        .pipe(gulp.dest('src'));
});

gulp.task('watch', function(){
    gulp.watch('src/**/*.scss',  ['styles']);
    gulp.watch('src/icons/*.svg',  ['icons']);
});

gulp.task('preprocessor', function(cb){
    runSequence('icons','styles', cb);
});

gulp.task('preprocessor-watch', function(cb){
    runSequence('icons','styles', 'watch', cb);
});