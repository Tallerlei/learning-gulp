var gulp = require('gulp'),
    // prefixes css to match browser specification
    autoprefixer = require('gulp-autoprefixer'),
    // transpiles scss into css
    sass = require('gulp-sass'),
    // removes all unnecessary characters
    minifycss = require('gulp-minify-css'),
    // renaming files and fileextensions
    rename = require('gulp-rename'),
    // concatinates files
    concat = require('gulp-concat'),
    // rewrites js code to be short and undescriptive :)
    uglify = require('gulp-uglify'),
    // jshint
    jshint = require('gulp-jshint'),

    changed = require('gulp-changed'),

    imagemin = require('gulp-imagemin'),

    minifyhtml = require('gulp-minify-html'),

    clean = require('gulp-clean');

gulp.task('process-styles', function() {
    return gulp.src('src/styles/main.scss')
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
        .pipe(minifycss())
        .pipe(gulp.dest('dest/styles/'));
});

gulp.task('process-scripts', function(){
    return gulp.src('src/scripts/*.js')
    .pipe(jshint())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dest/scripts/'))
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dest/scripts/'));
});

// Bilder (angeblich) verlustfrei komprimieren
gulp.task('compress-images',function(){
    return gulp.src('src/images/**/*')
    .pipe(changed('dest/images'))
    .pipe(imagemin())
    .pipe(gulp.dest('dest/images'));
});

// gulp watch führt bei Änderung automatisch tasks aus
gulp.task('watch', function(){
    gulp.watch('src/scripts/*.js', ['process-scripts']);
    gulp.watch('src/styles/*.scss', ['process-styles']);
    gulp.watch('*.*', ['default']);
});

gulp.task('default', function() {

    console.log("Something was changed!!!");
});
