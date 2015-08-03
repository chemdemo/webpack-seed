/*
* @Author: dmyang
* @Date:   2015-08-02 14:16:41
* @Last Modified by:   dmyang
* @Last Modified time: 2015-08-04 00:55:55
*/

'use strict';

// @see http://christianalfoni.github.io/javascript/2014/12/13/did-you-know-webpack-and-react-is-awesome.html
// @see https://github.com/webpack/react-starter/blob/master/make-webpack-config.js

var path = require('path');
var fs = require('fs');

var webpack = require('webpack');
var _ = require('lodash');

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

var pageSrc = path.resolve(process.cwd(), 'src');
var assets = 'assets/';
var sourceMap = require('./src/sourcemap.json');

var excludeFromStats = [
    /node_modules[\\\/]items-store[\\\/]/
];

function makeConf(options) {
    options = options || {};

    var debug = options.debug !== undefined ? options.debug : true;
    var entries = genEntries();
    var chunks = Object.keys(entries);
    var config = {
        entry: entries,

        output: {
            // 在debug模式下，__build目录是虚拟的，webpack的dev server存储在内存里
            path: path.resolve(debug ? '__build' : assets),
            filename: debug ? '[name].js' : 'js/[chunkhash:8].[name].min.js',
            chunkFilename: debug ? '[name].js' : 'js/[chunkhash:8].chunk.min.js',
            hotUpdateChunkFilename: debug ?'[name].js' : 'js/[id].[chunkhash:8].min.js',
            publicPath: ''
        },

        resolve: {
            root: [pageSrc],
            alias: sourceMap,
            extensions: ['', '.js', '.css', '.scss', '.html', '.tpl', '.png', '.jpg']
        },

        resolveLoader: {
            root: path.join(__dirname, 'node_modules')
        },

        plugins: [
            new CommonsChunkPlugin({
                name: 'vendors',
                chunks: chunks,
                // Modules must be shared between 3 entries
                minChunks: chunks.length // 提取所有chunks共同依赖的模块
            })
        ],

        module: {
            noParse: ['zepto'],
            loaders: [
                {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    loaders: [
                        'image?{bypassOnDebug: true, progressive:true, \
                            optimizationLevel: 3, pngquant:{quality: "65-80", speed: 4}}',
                        // url-loader更好用，小于10KB的图片会自动转成dataUrl，
                        // 否则则调用file-loader，参数直接传入
                        'url?limit=10000&name=img/[hash:8].[name].[ext]',
                    ]
                },
                {
                    test: /\.(woff|eot|ttf)$/i,
                    loader: 'url?limit=10000&name=fonts/[hash:8].[name].[ext]'
                },
                {test: /\.(tpl|ejs)$/, loader: 'ejs'},
                {test: /\.js$/, exclude: /node_modules/, loader: 'jsx'}
            ]
        },

        devServer: {
            stats: {
                cached: false,
                exclude: excludeFromStats,
                colors: true
            }
        }
    };

    if(debug) {
        // 开发阶段，css直接内嵌
        var cssLoader = {
            test: /\.css$/,
            loader: 'style!css'
        };
        config.module.loaders.push(cssLoader);
    } else {
        // 编译阶段，css分离出来单独引入
        var cssLoader = {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('css?sourceMap&-minimize')
        };
        config.module.loaders.push(cssLoader);
        config.plugins.push(new ExtractTextPlugin('css/[chunkhash:8].[name].css'));

        // 自动生成入口文件，入口js名必须和入口文件名相同
        // 例如，a页的入口文件是a.html，那么在js目录下必须有一个a.js作为入口文件
        var pages = fs.readdirSync(pageSrc);

        pages.forEach(function(filename) {
            var m = filename.match(/(.+)\.html$/);

            if(m) {
                // @see https://github.com/kangax/html-minifier
                var conf = {
                    template: path.resolve(pageSrc, filename),
                    filename: filename
                };

                if(m[1] in config.entry) {
                    conf.inject = 'body';
                    conf.chunks = ['vendors', m[1]];
                }

                config.plugins.push(new HtmlWebpackPlugin(conf));
            }
        });

        config.plugins.push(new UglifyJsPlugin());
    }

    return config;
}

function genEntries() {
    var jsDir = path.resolve(pageSrc, 'js');
    var names = fs.readdirSync(jsDir);
    var map = {};

    names.forEach(function(name) {
        var m = name.match(/(.+)\.js$/);
        var entry = m ? m[1] : '';
        var entryPath = entry ? path.resolve(jsDir, name) : '';

        if(entry) map[entry] = entryPath;
    });

    return map;
}

module.exports = makeConf;
