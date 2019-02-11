var gulp = require('gulp');
var inject = require('gulp-inject');
var webserver = require('gulp-webserver');
var htmlclean = require('gulp-htmlclean');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var paths = {
  src: 'src/**/*',
  srcHTML: 'src/**/*.html',
  srcASSETS: 'src/assets/**/*',
  srcCSS: 'src/**/*.css',
  srcJS: 'src/**/*.js',
  tmp: 'tmp',
  tmpIndex: 'tmp/index.html',
  tmpASSETS: 'tmp/assets/**/*',
  tmpCSS: 'tmp/**/*.css',
  tmpJS: 'tmp/**/*.js',
  dist: 'dist',
  distIndex: 'dist/index.html',
  distASSETS: 'dist/assets/**/*',
  distCSS: 'dist/**/*.css',
  distJS: 'dist/**/*.js'
};
gulp.task('html', function () {
  return gulp.src(paths.srcHTML).pipe(gulp.dest(paths.tmp));
});
gulp.task('assets', function () {
  return gulp.src(paths.srcASSETS).pipe(gulp.dest(paths.tmp + "/assets"));
});
gulp.task('css', function () {
  return gulp.src(paths.srcCSS).pipe(gulp.dest(paths.tmp));
});
gulp.task('js', function () {
  return gulp.src(paths.srcJS).pipe(gulp.dest(paths.tmp));
});
gulp.task('copy', gulp.parallel('html', 'assets', 'css', 'js'));
gulp.task('inject', gulp.series('copy', function () {
  var css = gulp.src(paths.tmpCSS);
  var js = gulp.src(paths.tmpJS);
  return gulp.src(paths.tmpIndex)
    .pipe(inject(css, {
      relative: true
    }))
    .pipe(inject(js, {
      relative: true
    }))
    .pipe(gulp.dest(paths.tmp));
}));
gulp.task('serve', gulp.series('inject', function () {
  return gulp.src(paths.tmp)
    .pipe(webserver({
      port: 8080,
      livereload: true
    }));
}));
gulp.task('watch', gulp.series('serve', function () {
  gulp.watch(paths.src, gulp.series('inject', function () {}));
}));

gulp.task('html:dist', function () {
  return gulp.src(paths.srcHTML)
    .pipe(htmlclean())
    .pipe(gulp.dest(paths.dist));
});
gulp.task('assets:dist', function () {
  return gulp.src(paths.tmpASSETS)
  .pipe(gulp.dest(paths.dist + "/assets"));
//  return gulp.src(paths.srcHTML)
//    .pipe(htmlclean())
//    .pipe(gulp.dest(paths.dist));
});
gulp.task('css:dist', function () {
  return gulp.src(paths.srcCSS)
    .pipe(concat('style.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.dist));
});
gulp.task('js:dist', function () {
  return gulp.src(paths.srcJS)
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist));
});
gulp.task('copy:dist',
  gulp.series( ['html:dist', 'assets:dist','css:dist', 'js:dist'],
  function (done) {
  done();
}));
gulp.task('inject:dist', gulp.series('copy:dist', function () {
  var css = gulp.src(paths.distCSS);
  var js = gulp.src(paths.distJS);
  return gulp.src(paths.distIndex)
    .pipe(inject(css, {
      relative: true
    }))
    .pipe(inject(js, {
      relative: true
    }))
    .pipe(gulp.dest(paths.dist));
}));
gulp.task('build', gulp.series('inject:dist', function (done) {
  done();
}));


gulp.task('default', function () {
  console.log('Hello World!');
});