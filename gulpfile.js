var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');

gulp.task('sass', function() {
  gulp.src('app/stylesheets/style.scss')
  .pipe(plumber())
  .pipe(sass())
  .pipe(gulp.dest('public/css'));
});

gulp.task('watch', function() {
  gulp.watch('app/stylesheets/*.scss', ['sass']);
});

gulp.task('default', ['sass', 'watch']);
