const gulp = require('gulp');
const env = process.env.NODE_ENV || 'development';

if (env === 'production') {
  require('./gulpfile.prod');
} else {
  require('./gulpfile.dev');
}

gulp.task('default', gulp.series('build'));
