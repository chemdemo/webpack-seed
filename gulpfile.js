/*
* @Author: dmyang
* @Date:   2015-06-16 15:19:59
* @Last Modified by:   dmyang
* @Last Modified time: 2015-08-27 11:16:12
*/

'use strict';

var gulp = require('gulp');
var webpack = require('webpack');

var gutil = require('gulp-util');

var webpackConf = require('./webpack.config');
var webpackDevConf = require('./webpack-dev.config');

var src = process.cwd() + '/src';
var assets = process.cwd() + '/assets';

// js check
gulp.task('hint', function() {
    var jshint = require('gulp-jshint');
    var stylish = require('jshint-stylish');

    return gulp.src([
            '!' + src + '/js/lib/**/*.js',
            src + '/js/**/*.js'
        ])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

// clean assets
gulp.task('clean', ['hint'], function() {
    var clean = require('gulp-clean');

    return gulp.src(assets, {read: true}).pipe(clean());
});

// run webpack pack
gulp.task('pack', ['clean'], function(done) {
    webpack(webpackConf, function(err, stats) {
        if(err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString({colors: true}));
        done();
    });
});

// html process
gulp.task('default', ['pack'], function() {
    var replace = require('gulp-replace');
    var htmlmin = require('gulp-htmlmin');

    return gulp
        .src(assets + '/*.html')
        .pipe(replace(/<script(.+)?data-debug([^>]+)?><\/script>/g, ''))
        // @see https://github.com/kangax/html-minifier
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest(assets));
});

// deploy assets to remote server
gulp.task('deploy', function() {
    var sftp = require('gulp-sftp');

    return gulp.src(assets + '/**')
        .pipe(sftp({
            host: '[remote server ip]',
            remotePath: '/www/app/',
            user: 'foo',
            pass: 'bar'
        }));
});

// run HMR on `cli` mode
// @see http://webpack.github.io/docs/webpack-dev-server.html
gulp.task('hmr', function(done) {
    var WebpackDevServer = require('webpack-dev-server');
    var compiler = webpack(webpackDevConf);
    var devSvr = new WebpackDevServer(compiler, {
        contentBase: webpackConf.output.path,
        publicPath: webpackDevConf.output.publicPath,
        hot: true,
        stats: webpackDevConf.devServer.stats,
    });

    devSvr.listen(8080, '0.0.0.0', function(err) {
        if(err) throw new gutil.PluginError('webpack-dev-server', err);

        gutil.log('[webpack-dev-server]',
            'http://localhost:8088/webpack-dev-server/index.html');

        // keep the devSvr alive
        // done();
    });
});
