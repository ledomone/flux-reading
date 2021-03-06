var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var watchify = require('watchify');
var sourcemaps = require('gulp-sourcemaps');
var resolutions = require('browserify-resolutions');

var production = process.env.NODE_ENV === 'production';

var dependencies = [
  'alt',
  'react',
  'react-dom',
  'react-router',
  // 'underscore'
];


/*
 |--------------------------------------------------------------------------
 | Combine all JS libraries into a single file for fewer HTTP requests.
 |--------------------------------------------------------------------------
 */
gulp.task('vendor', function() {
  return gulp.src([
    'bower_components/jquery/dist/jquery.js',
    'bower_components/bootstrap-sass/assets/javascripts/bootstrap/affix.js',
    'bower_components/bootstrap-sass/assets/javascripts/bootstrap/alert.js',
    'bower_components/bootstrap-sass/assets/javascripts/bootstrap/button.js',
    'bower_components/bootstrap-sass/assets/javascripts/bootstrap/carousel.js',
    'bower_components/bootstrap-sass/assets/javascripts/bootstrap/collapse.js',
    'bower_components/bootstrap-sass/assets/javascripts/bootstrap/dropdown.js',
    'bower_components/bootstrap-sass/assets/javascripts/bootstrap/tab.js',
    'bower_components/bootstrap-sass/assets/javascripts/bootstrap/transition.js',
    'bower_components/bootstrap-sass/assets/javascripts/bootstrap/scrollspy.js',
    'bower_components/bootstrap-sass/assets/javascripts/bootstrap/modal.js',
    'bower_components/bootstrap-sass/assets/javascripts/bootstrap/tooltip.js',
    'bower_components/bootstrap-sass/assets/javascripts/bootstrap/popover.js',
    'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
    'bower_components/toastr/toastr.js'
  ]).pipe(concat('vendor.js'))
    .pipe(gulpif(production, uglify({ mangle: false })))
    .pipe(gulp.dest('public/js'));
});

/*
 |--------------------------------------------------------------------------
 | Compile third-party dependencies separately for faster performance.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify-vendor', function() {
  return browserify()
    .require(dependencies)
    .bundle()
    .pipe(source('vendor.bundle.js'))
    .pipe(buffer())
    .pipe(gulpif(production, uglify({ mangle: false })))
    .pipe(gulp.dest('public/js'));
});

/*
 |--------------------------------------------------------------------------
 | Compile only project files, excluding all third-party dependencies.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify', ['browserify-vendor'], function() {
  return browserify({ entries: 'app/main.js', debug: true })
    .external(dependencies)
    .plugin(resolutions, '*')
    .transform(babelify, { presets: ['es2015', 'react'] })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(gulpif(production, uglify({ mangle: false })))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/js'));
});

/*
 |--------------------------------------------------------------------------
 | Same as browserify task, but will also watch for changes and re-compile.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify-watch', ['browserify-vendor'], function() {
  var bundler = watchify(browserify({ entries: 'app/main.js', debug: true }, watchify.args));
  bundler.external(dependencies);
  bundler.transform(babelify, { presets: ['es2015', 'react'] });
  bundler.on('update', rebundle);
  return rebundle();

  function rebundle() {
    var start = Date.now();
    return bundler.bundle()
      .on('error', function(err) {
        gutil.log(gutil.colors.red(err.toString()));
      })
      .on('end', function() {
        gutil.log(gutil.colors.green('Finished rebundling in', (Date.now() - start) + 'ms.'));
      })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('public/js/'));
  }
});

/*
 |--------------------------------------------------------------------------
 | Compile SASS stylesheets.
 |--------------------------------------------------------------------------
 */
gulp.task('styles', function() {
  gulp.src(['app/stylesheets/**/*.scss'])
  .pipe(plumber())
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('public/css'));

  //copy over the bootstrap fonts
  gulp.src('bower_modules/bootstrap-sass/assets/fonts/bootstrap/*')
      .pipe(gulp.dest('public/fonts'));
});

gulp.task('watch', function() {
  gulp.watch('app/stylesheets/**/*.scss', ['styles']);
});

gulp.task('default', ['styles', 'vendor', 'browserify-watch', 'watch']);
gulp.task('build', ['styles', 'vendor', 'browserify']);
