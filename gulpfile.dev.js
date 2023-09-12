const gulp = require('gulp');
const concat = require('gulp-concat');
const useref = require('gulp-useref');
const replace = require('gulp-replace');
const cachebust = require('gulp-cache-bust');
const minify = require('gulp-minify');
const browserSync = require('browser-sync').create(); // 引入browser-sync

gulp.task('css', function () {
    return gulp.src('src/css/*.css')
        .pipe(concat('all.css'))
        .pipe(gulp.dest('dist'));
});

gulp.task('js', function () {
    return gulp.src(['src/js/*.js', 'src/lib/*.js'])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('loading', function () {
    return gulp.src('src/js/loading.js')
        .pipe(gulp.dest('dist'));
});

gulp.task('index', function () {
    return gulp.src('src/*.html')
        .pipe(useref())
        .pipe(cachebust({ type: 'timestamp' }))
        .pipe(gulp.dest('dist'));
});

// no service worker implemented yet
gulp.task('cache', function () {
    return gulp.src(['./src/serviceworker.js'])
        .pipe(replace('<timestamp>', Date.now()))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('manifest', function () {
    return gulp.src(['./src/site.webmanifest'])
        .pipe(gulp.dest('./dist/'));
});

gulp.task('images', function () {
    return gulp.src(['src/images/**/*'])
        .pipe(gulp.dest('dist/images'));
});

gulp.task('extensions', function () {
    return gulp.src(['src/extensions/**/*'])
        .pipe(gulp.dest('dist/extensions'));
});

gulp.task('shapelib', function () {
    return gulp.src(['src/shapelib/**/*'])
        .pipe(gulp.dest('dist/shapelib'));
});

gulp.task('canvg', function () {
    return gulp.src(['src/js/lib/canvg.js', 'src/js/lib/rgbcolor.js'])
        .pipe(gulp.dest('dist/js/lib'));
});

gulp.task('i18n', function(){
    return gulp.src(['src/locales/**/*'])
        .pipe(gulp.dest('dist/locales'));
});

gulp.task('dev',
    gulp.series(
        'css',
        'js',
        'index',
        'manifest',
        'images',
        'extensions',
        'shapelib',
        'canvg',
        'i18n'
    )
);

gulp.task('watch', function () {
    // 初始化BrowserSync
    browserSync.init({
        server: {
            baseDir: './dist' // 你的项目的输出目录
        },
        port: 51200 // 本地开发服务器端口
    });

    gulp.watch('src/css/*.css', gulp.series('css'));
    gulp.watch(['src/js/*.js', 'src/lib/*.js'], gulp.series('js'));
    gulp.watch('src/js/loading.js', gulp.series('loading'));
    gulp.watch('src/*.html', gulp.series('index'));
    gulp.watch('src/serviceworker.js', gulp.series('cache'));
    gulp.watch('src/site.webmanifest', gulp.series('manifest'));
    gulp.watch('src/images/**/*', gulp.series('images'));
    gulp.watch('src/extensions/**/*', gulp.series('extensions'));
    gulp.watch('src/shapelib/**/*', gulp.series('shapelib'));
    gulp.watch(['src/js/lib/canvg.js', 'src/js/lib/rgbcolor.js'], gulp.series('canvg'));
    gulp.watch('src/locales/**/*', gulp.series('i18n'));

    gulp.watch('dist/**/*').on('change', browserSync.reload);
});


gulp.task('build', gulp.series('dev', gulp.parallel('watch')));

