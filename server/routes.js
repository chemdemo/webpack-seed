/*
* @Author: dmyang
* @Date:   2015-07-31 11:41:38
* @Last Modified by:   dmyang
* @Last Modified time: 2016-02-02 11:08:44
*/

'use strict';

var fs = require('fs');

var render = require('koa-ejs');
var proxy = require('koa-proxy');

var list = require('../mock/list');

module.exports = function(router, app, staticDir) {
    // mock api
    router.get('/api/list', function*() {
        var query = this.query || {};
        var offset = query.offset || 0;
        var limit = query.limit || 10;
        var diff = limit - list.length;

        if(diff <= 0) {
            this.body = {code: 0, data: list.slice(0, limit)};
        } else {
            var arr = list.slice(0, list.length);
            var i = 0;

            while(diff--) arr.push(arr[i++]);

            this.body = {code: 0, data: arr};
        }
    });

    // proxy api
    router.get('/api/foo/bar', proxy({url: 'http://foo.bar.com'}));

    render(app, {
        root: __dirname,
        layout: false,
        viewExt: 'html',
        cache: false,
        debug: true
    });

    router.get('/', function*() {
        var pages = fs.readdirSync(staticDir);

        pages = pages.filter(function(page) {
            return /\.html$/.test(page);
        });

        yield this.render('home', {pages: pages || []});
    });
};
