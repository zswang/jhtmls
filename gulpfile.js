/*jshint globalstrict: true*/
/*global require*/

'use strict';

var gulp = require('gulp');
var util = require('util');
var jdists = require('gulp-jdists');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var examplejs = require('gulp-examplejs');

gulp.task('build', function() {
  return gulp.src(['src/jhtmls.js'])
    .pipe(jdists({
      trigger: 'release'
    }))
    .pipe(gulp.dest('./'))
    .pipe(uglify())
    .pipe(rename('jhtmls.min.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('example', function() {
  return gulp.src('src/**.js')
    .pipe(jdists({
      trigger: 'example'
    }))
    .pipe(examplejs({
      header: "var jhtmls = require('../');\n"
    }))
    .pipe(gulp.dest('test'));
});

gulp.task('default', ['build']);