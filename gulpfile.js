'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins');
var browserSync = require('browser-sync').create();
var hoxy = require('hoxy');
var opn = require('opn');

var hostname = 'example.com';

gulp.task('proxy', function (callback) {
  var proxy = hoxy.createServer().listen(8888, function () {
    callback();
  });
  proxy.intercept({
    phase: 'request',
    hostname: hostname
  }, function (req) {
    req.hostname = 'localhost';
    req.port = '9000';
  });
});

gulp.task('serve', ['proxy'], function () {
  browserSync.init({
    notify: false,
    port: 9000,
    open: false,
    server: {
      baseDir: 'app'
    }
  }, function () {
    opn('http://' + hostname);
  });
  gulp.watch([
    'app/**'
  ]).on('change', browserSync.reload);
});

gulp.task('default', ['serve']);
