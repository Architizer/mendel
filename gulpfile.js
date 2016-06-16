'use strict';

var gulp = require('gulp');

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('test', function () {
  // placeholder test
  return true;
});