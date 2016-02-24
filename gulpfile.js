var gulp = require('gulp'),
  // prefixes css to match browser specification
  autoprefixer = require('gulp-autoprefixer'),
  // transpiles scss into css
  sass = require('gulp-sass');

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
    .pipe(gulp.dest('dest/styles/'));
});

gulp.task('default', function() {

  console.log("I have configured a gulp file!");
});
