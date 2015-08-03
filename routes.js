/*
* @Author: dmyang
* @Date:   2015-07-31 11:41:38
* @Last Modified by:   dmyang
* @Last Modified time: 2015-08-04 01:19:15
*/

'use strict';

var proxy = require('koa-proxy');

var list = require('./mock/list');

module.exports = function(router, app) {
    // mock data
    router.get('/api/list', function*() {
        this.body = list;
    });

    // proxy api for in another domain
    router.get('/api/foo', proxy());
};
