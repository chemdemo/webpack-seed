/*
* @Author: dm.yang
* @Date:   2015-02-10 13:55:26
* @Last Modified by:   dmyang
* @Last Modified time: 2015-08-05 01:40:43
*/

'use strict';

console.info('require ajax module.');

var report = require('./report');

function $ajax(options, retries) {
    var $defer = $.Deferred();
    var isRetry = options._retry;

    if(!options.url) throw Error('request url required');

    retries = retries !== undefined ? retries : 2;

    if(!options.type) options.type = 'GET';
    if(!options.timeout) options.timeout = 5000;

    // all promise
    delete options.success;
    delete options.error;
    delete options.complete;

    if(!options.data) options.data = {};
    options.data._t = Date.now();

    $.ajax(options)
        .done(function(r) {
            if(!r || r.code != 0) onFail(r, r.code == -9999 ? 0 : retries);
            else $defer.resolve(r.data || {});

            // for stating
            if(isRetry) report(options.url.replace(/\//g, '_') + '_succ_retry');
        })
        .fail(function(xhr, errType, error) {
            var code = xhr.status;
            // errType: "timeout", "error", "abort", "parsererror"
            if(!(code >= 500 && code <= 502) || !/timeout|error/.test(errType)) retries = 0;
            onFail(error || {message: 'network error, please retry.'}, retries);
        });

    function onFail(err, retries) {
        var u = options.url.replace(/\//g, '_');

        if(err.code !== undefined) report(u + '_fail_' + err.code);

        if(retries) {
            if(!options._retry) options._retry = 1;
            report(u + '_retry');
            $ajax(options, --retries).done($defer.resolve).fail($defer.reject);
        } else {
            $defer.reject(err);
            report(u + '_err');
        }
    }

    return $defer.promise();
}

exports.req = exports.request = $ajax;
