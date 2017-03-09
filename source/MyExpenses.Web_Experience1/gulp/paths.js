'use strict';

var roots = {
    base: './',
    libs: './node_modules',
    dist: './client/dist',
    src: './client/app',
    server: './server'
};

module.exports = {
    libs: {
        js: [
            roots.libs + '/jquery/dist/jquery.js',
            roots.libs + '/jquery.dotdotdot/src/js/jquery.dotdotdot.js',
            roots.libs + '/moment/moment.js',
            roots.libs + '/toastr/toastr.js',
            roots.libs + '/angular/angular.js',
            roots.libs + '/adal-angular/lib/adal.js',
            roots.libs + '/adal-angular/lib/adal-angular.js',
            roots.libs + '/angular-route/angular-route.js',
            roots.libs + '/angular-animate/angular-animate.js',
            roots.libs + '/angular-sanitize/angular-sanitize.js',
            roots.libs + '/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
            roots.libs + '/bootstrap/dist/js/bootstrap.js',
            roots.libs + '/bootstrap-datepicker/dist/js/bootstrap-datepicker.js',
            roots.libs + '/bootstrap-switch/dist/js/bootstrap-switch.js', 
            roots.libs + '/angular-img-http-src/index.js',
            roots.src + '/polyfill/Function.name.js'
        ],

        css: [
            roots.libs + '/bootstrap/dist/css/bootstrap.css',
            roots.libs + '/bootstrap-datepicker/dist/css/bootstrap-datepicker.css',
            roots.libs + '/bootstrap-switch/dist/css/bootstrap-switch.css',
            roots.libs + '/bootstrap-switch/dist/css/bootstrap-switch.css',
            roots.libs + '/toastr/build/toastr.css',
            roots.libs + '/animate.css/animate.css'
        ]
    },

    debug: {
        index: roots.src + '/index.html',

        fonts: {
            dist: roots.dist + '/fonts',
            src: roots.src + '/fonts/**/*.*'
        },

        images: {
            dist: roots.dist + '/images',
            src: roots.src + '/images/**/*.*'
        },

        server: {
            js: {
                files: [roots.base + '/server.js', roots.server + '/**/*.js']
            }
        },

        js: {
            dist: {
                folder: roots.dist + '/js',
                files: [roots.dist + '/js/vendor/jquery.js',
                        roots.dist + '/js/vendor/angular.js',
                        roots.dist + '/js/vendor/**/*.js',
                        roots.dist + '/js/configs.js',
                        roots.dist + '/js/app-tpls.js',
                        roots.dist + '/js/app.js',
                        roots.dist + '/js/**/*.js'],
            },

            src: {
                folder: roots.src + '/modules/',
                files: [roots.src + '/modules/**/*.js']
            },

            vendor: {
                folder: roots.dist + '/js/vendor',
                files: [roots.dist + '/js/vendor/**/jquery.js',
                        roots.dist + '/js/vendor/**/angular.js',
                        roots.dist + '/js/vendor/**/*.js']
            }
        },

        less: {
            src: {
                folder: roots.src + '/less/',
                files: [roots.src + '/less/**/*.less']
            },

            dist: {
                folder: roots.dist + '/css',
                files:  roots.dist + '/css/**/*.css'
                
            }
        },

        templates: {
            dist: {
                folder: roots.dist + '/templates',
                files: roots.dist + '/templates/**/*.js'
            },

            src: [roots.src + '/templates/**/*.html']
        }
    },

    release: {
        dist: {
            folder: roots.dist,
            files: roots.dist + '/**/*.*'
        },
        
        js: [roots.dist + '/vendor.min.js', roots.dist + '/app.min.js', roots.dist + '/templates/dist-tpls.js'],

        scss: roots.dist + '/main.min.css'
    }
};
