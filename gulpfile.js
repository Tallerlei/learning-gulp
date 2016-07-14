/* loads all gulp plugins from package.json
        var gulpLoadPlugins = require('gulp-load-plugins'),
            plugins = gulpLoadPlugins();

        call them via plugin.pluginName (camel cased)
        */

var gulp = require('gulp'),
    // prefixes css to match browser specification
    autoprefixer = require('gulp-autoprefixer'),
    // transpiles scss into css
    sass = require('gulp-sass'),
    // removes all unnecessary characters
    minifyCss = require('gulp-minify-css'),
    // renaming files and fileextensions
    rename = require('gulp-rename'),
    // concatinates files
    concat = require('gulp-concat'),
    // rewrites js code to be short and undescriptive :)
    uglify = require('gulp-uglify'),
    // creates sourcemaps for debugging minified code
    sourcemaps = require('gulp-sourcemaps'),
    // jshint
    jshint = require('gulp-jshint'),
    // just copies new files to destination folder
    changed = require('gulp-changed'),
    // compresses images for web
    imagemin = require('gulp-imagemin'),
    // minifies HTML
    minifyHtml = require('gulp-minify-html'),
    // allows notifications
    notify = require('gulp-notify'),
    // see changes to files live in Browser. Needs Browser Plugin too
    livereload = require('gulp-livereload'),
    // deletes files in specified folder
    clean = require('gulp-clean'),
    // removes debugger and console.logs
    stripDebug = require('gulp-strip-debug'),
    // plumber logs errors but prevents gulp from stop running
    plumber = require('gulp-plumber'),
    // allows console parameters
    argv = require('yargs').argv,
    // replace Strings and RegExp
    replace = require('gulp-replace');


gulp.task('process-styles', function () {
    return gulp.src('src/styles/main.scss')
        .pipe(changed('dest/styles/'))
        .pipe(sass({
            style: 'expanded'
        }))
        .pipe(autoprefixer({
            // Which Browserversions should be included?
            browsers: ['last 2 versions', '> 5%', 'ie 9', 'ie 10'],
            cascade: false
        }))
        // specifies destination folder for fileoutput
        .pipe(gulp.dest('dest/styles/'))
        // add suffix .min
        .pipe(rename({
            suffix: '.min'
        }))
        // minify...
        .pipe(minifyCss())
        .pipe(gulp.dest('dest/styles/'))
        .pipe(notify("processing styles completed!"));
});

gulp.task('process-scripts', function () {
    return gulp.src('src/scripts/*.js')
        .pipe(plumber())
        .pipe(changed('dest/scripts/'))
        .pipe(stripDebug())
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        // Task fails if jshint has errors
        .pipe(jshint.reporter('fail'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dest/scripts/'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dest/scripts/'))
        .pipe(notify("processing scripts completed!"));
});


// miniTask um nur console, alert, debugger und confirm zu entfernen
// Use gulp devClean --path="pathtojsfiles"
// Uglify and Mapping is deactivated
gulp.task('devCleanLight', function () {
    return gulp.src(argv.path + '/*.js')
        .pipe(plumber())
        .pipe(notify(argv.path))
        // .pipe(sourcemaps.init())
        .pipe(stripDebug())
        // replace void 0; from stripDebug only needed if uglify is deactivated
        .pipe(replace('void 0;', ''))
        // .pipe(uglify())
        // .pipe(sourcemaps.write(argv.path + '/maps'))
        .pipe(gulp.dest(argv.path + '/'));
});

// creates sourcemaps, minifies and removes console, alert and debugger
// Use gulp devClean --path="pathtojsfiles"
gulp.task('devCleanFull', function () {
    return gulp.src(argv.path + '/*.js')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(sourcemaps.write(argv.path + '/maps'))
        .pipe(gulp.dest(argv.path + '/'));
});

// miniTask um nur console, alert, debugger und confirm zu entfernen
gulp.task('test', function () {
    return gulp.src('src/scripts/*.js')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(notify(argv.path))
        .pipe(stripDebug())
        // replace all console, alert and confirm with and without following ; and also replace debugger;
        // /((console.log|console.trace|alert|confirm)(.*)\)\"{0};?|debugger\;)/g, ''
        .pipe(replace('void 0;', ''))
        .pipe(uglify())
        .pipe(sourcemaps.write('/maps'))
        .pipe(gulp.dest('dest/scripts/'));
});

// Bilder (angeblich) verlustfrei komprimieren
gulp.task('compress-images', function () {
    return gulp.src('src/images/**/*')
        .pipe(changed('dest/images/'))
        .pipe(imagemin())
        .pipe(gulp.dest('dest/images/'))
        .pipe(notify("compressing images done!"));
});

// Copy HTML
gulp.task('process-html', function () {
    return gulp.src('src/*.html')
        .pipe(changed('dest/'))
        .pipe(minifyHtml())
        .pipe(gulp.dest('dest/'));
});

// gulp watch führt bei Änderung automatisch tasks aus
gulp.task('watch', function () {
    // Create LiveReload server
    livereload.listen({
        reloadPage: 'dest/index.html'
    });
    gulp.watch('src/*.html', ['process-html']);
    gulp.watch('src/scripts/**/*.js', ['process-scripts']);
    gulp.watch('src/styles/**/*.scss', ['process-styles']);
    gulp.watch('src/images/**/*', ['compress-images']);

    // Watch any files in dist/, reload on change
    gulp.watch(['dest/**']).on('change', livereload.changed);
});

// cleanup destination folder in case there are files that do not exist anymore
gulp.task('clean', function () {
    // read: false makes the task faster
    return gulp.src(['dest/scripts/**', 'dest/styles/**', 'dest/images/**'], {
            read: false
        })
        // For safety files and folders outside the current working directory can be removed only with option force set to true.
        .pipe(clean({
            force: true
        }));
});

// Default Task run with 'gulp' command. Dependency is cleaning up. Then doing a list of tasks
gulp.task('default', ['clean'], function () {

    gulp.start(['process-styles', 'process-scripts', 'process-html', 'compress-images']);
});
