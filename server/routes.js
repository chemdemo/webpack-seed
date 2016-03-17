/*
* @Author: dmyang
* @Date:   2015-07-31 11:41:38
* @Last Modified by:   dmyang
* @Last Modified time: 2016-03-17 19:23:10
*/

'use strict';

const fs = require('fs');

const render = require('koa-ejs');
const proxy = require('koa-proxy');

const list = require('../mock/list');

module.exports = (router, app, staticDir) => {
    // mock api
    router.get('/api/list', function*() {
        let query = this.query || {};
        let offset = query.offset || 0;
        let limit = query.limit || 10;
        let diff = limit - list.length;

        if(diff <= 0) {
            this.body = {code: 0, data: list.slice(0, limit)};
        } else {
            let arr = list.slice(0, list.length);
            let i = 0;

            while(diff--) arr.push(arr[i++]);

            this.body = {code: 0, data: arr};
        }
    });

    // proxy api
    router.get('/api/foo/bar', proxy({host: 'http://foo.bar.com'}));

    render(app, {
        root: __dirname,
        layout: false,
        viewExt: 'html',
        cache: false,
        debug: true
    });

    router.get('/', function*() {
        let pages = fs.readdirSync(staticDir);

        pages = pages.filter((page) => {
            return /\.html$/.test(page);
        });

        yield this.render('home', {pages: pages || []});
    });
};
