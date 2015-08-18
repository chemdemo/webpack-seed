/*
* @Author: dmyang
* @Date:   2015-08-05 00:35:47
* @Last Modified by:   dmyang
* @Last Modified time: 2015-08-18 20:06:17
*/

'use strict';

console.info('require module b.');

require('commonCss');
require('../css/b.css');

require('zepto');

var _ = require('underscore');

var report = require('./helpers/report');
var ajax = require('./helpers/ajax');
