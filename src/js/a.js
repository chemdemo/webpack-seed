/*
* @Author: dmyang
* @Date:   2015-08-05 00:25:43
* @Last Modified by:   dmyang
* @Last Modified time: 2015-08-05 02:49:34
*/

'use strict';

console.info('require module a.');

require('commonCss');
require('../css/a.css');

require('zepto');

var _ = require('underscore');

var url = require('./utils/url');
var report = require('./helpers/report');

var component = url.getQuery('component');

if('dialog' === component) {
    require.ensure([], function(require) {
        var dialog = require('./components/dialog');
        // todo ...
    });
}

if('toast' === component) {
    require.ensure([], function(require) {
        var toast = require('./components/toast');
        // todo ...
    });
}

require.ensure([], function() {
    var ajax = require('./helpers/ajax');

    ajax.request({
        url: '/api/list',
        data: {
            offset: 0,
            limit: 5
        }
    }).done(function(data) {
        var template = require('../tmpl/list.tpl');
        var html = template({list: data || []});

        $('#list').html(html);
    });
});

var logoImg = require('webpackLogo');
var $logo = $('<img />').attr('src', logoImg);

$('#logo').html($logo);
