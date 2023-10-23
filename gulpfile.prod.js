const gulp = require('gulp');
const concat = require('gulp-concat');
const useref = require('gulp-useref');
const replace = require('gulp-replace');
const cachebust = require('gulp-cache-bust');
const minify = require('gulp-minify');
const fs = require('fs');

function setEnv(){
    const env = process.env.ENV
    fs.writeFileSync("./src/js/env.js", `function getEnv() { return '${env}' };`, function (err){
        console.log("error", err)
    });
}

setEnv()

gulp.task('css', function () {
  return gulp.src('src/css/*.css')
    .pipe(concat('all.css'))
    .pipe(gulp.dest('svg-editor'));
});

gulp.task('js', function () {
  return gulp.src(['src/js/*.js', 'src/lib/*.js']) 
    .pipe(concat('all.js'))
    .pipe(gulp.dest('svg-editor'));
});

gulp.task('loading', function () {
  return gulp.src('src/js/loading.js')
    .pipe(gulp.dest('svg-editor'));
});

gulp.task('index', function () {
  return gulp.src('src/*.html')
    .pipe(useref())
    .pipe(cachebust({type: 'timestamp'}))
    .pipe(gulp.dest('svg-editor'));
});

// no service worker implemented yet
gulp.task('cache', function(){
  return gulp.src(['./src/serviceworker.js'])
    .pipe(replace('<timestamp>', Date.now()))
    .pipe(gulp.dest('./svg-editor/'));
});

gulp.task('manifest', function(){
  return gulp.src(['./src/site.webmanifest'])
    .pipe(gulp.dest('./svg-editor/'));
});

gulp.task('images', function(){
  return gulp.src(['src/images/**/*'])
    .pipe(gulp.dest('svg-editor/images'));
});

gulp.task('extensions', function(){
  return gulp.src(['src/extensions/**/*'])
    .pipe(gulp.dest('svg-editor/extensions'));
});

gulp.task('shapelib', function(){
  return gulp.src(['src/shapelib/**/*'])
    .pipe(gulp.dest('svg-editor/shapelib'));
});

gulp.task('canvg', function(){
  return gulp.src(['src/js/lib/canvg.js', 'src/js/lib/rgbcolor.js'])
    .pipe(gulp.dest('svg-editor/js/lib'));
});

gulp.task('i18n', function(){
  return gulp.src(['src/locales/**/*'])
    .pipe(gulp.dest('svg-editor/locales'));
});

gulp.task('build', 
  gulp.series(
      'css', 
      'js', 
      'index', 
      'manifest',
      'images',
      'extensions',
      'shapelib',
      'canvg',
      'i18n',
  )
);

gulp.task('default', gulp.series('build'));