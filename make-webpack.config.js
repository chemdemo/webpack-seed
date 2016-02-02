/*
* @Author: dmyang
* @Date:   2015-08-02 14:16:41
* @Last Modified by:   dmyang
* @Last Modified time: 2016-02-02 11:34:05
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

var srcDir = path.resolve(process.cwd(), 'src');
var nodeModPath = path.resolve(__dirname, './node_modules');
var build = '__build';
var assets = 'assets/';
var sourceMap = require('./src/sourcemap.json');

function makeConf(options) {
    options = options || {};

    var debug = options.debug !== undefined ? options.debug : true;
    var entries = genEntries();
    var chunks = Object.keys(entries);
    var config = {
        entry: Object.assign(entries, {
            'vender': ['zepto']
        }),

        output: {
            // 在debug模式下，__build目录是虚拟的，webpack的dev server存储在内存里
            path: path.resolve(assets),
            filename: debug ? '[name].js' : 'js/[chunkhash:8].[name].min.js',
            chunkFilename: debug ? 'chunk.js' : 'js/[chunkhash:8].chunk.min.js',
            hotUpdateChunkFilename: debug ? '[id].js' : 'js/[id].[chunkhash:8].min.js',
            publicPath: debug ? '/__build/' : ''
        },

        resolve: {
            root: [srcDir, './node_modules'],
            alias: sourceMap,
            extensions: ['', '.js', '.css', '.scss', '.tpl', '.png', '.jpg']
        },

        resolveLoader: {
            root: path.join(__dirname, 'node_modules')
        },

        module: {
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
                {test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel?presets[]=react,presets[]=es2015'}
            ]
        },

        plugins: [
            new CommonsChunkPlugin({
                name: 'common-b-c',
                chunks: ['b', 'c']
            }),
            new CommonsChunkPlugin({
                name: 'common',
                chunks: ['common-b-c', 'a']
            }),
            new CommonsChunkPlugin({
                name: 'vender',
                chunks: ['common']
            })
        ],

        devServer: {
            stats: {
                cached: false,
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
        var sassLoader = {
            test: /\.scss$/,
            loader: 'style!css!sass'
        };

        config.module.loaders.push(cssLoader);
        config.module.loaders.push(sassLoader);
    } else {
        // 编译阶段，css分离出来单独引入
        var cssLoader = {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style', 'css?minimize') // enable minimize
        };
        var sassLoader = {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract('style', 'css?minimize', 'sass')
        };

        config.module.loaders.push(cssLoader);
        config.module.loaders.push(sassLoader);
        config.plugins.push(
            new ExtractTextPlugin('css/[contenthash:8].[name].min.css', {
                // 当allChunks指定为false时，css loader必须指定怎么处理
                // additional chunk所依赖的css，即指定`ExtractTextPlugin.extract()`
                // 第一个参数`notExtractLoader`，一般是使用style-loader
                // @see https://github.com/webpack/extract-text-webpack-plugin
                allChunks: false
            })
        );

        // genHtml
        (function() {
            // 自动生成入口文件，入口js名必须和入口文件名相同
            // 例如，a页的入口文件是a.html，那么在js目录下必须有一个a.js作为入口文件
            var pages = fs.readdirSync(srcDir);

            pages.forEach(function(filename) {
                var m = filename.match(/(.+)\.html$/);

                if(m) {
                    // @see https://github.com/kangax/html-minifier
                    var conf = {
                        template: path.resolve(srcDir, filename),
                        // @see https://github.com/kangax/html-minifier
                        // minify: {
                        //     collapseWhitespace: true,
                        //     removeComments: true
                        // },
                        filename: filename
                    };
                    var mod = m[1];

                    if(mod in entries) {
                        conf.inject = 'body';
                        conf.chunks = ['vender', 'common', mod];
                    }

                    config.plugins.push(new HtmlWebpackPlugin(conf));
                }
            });
        }());

        config.plugins.push(new UglifyJsPlugin());
    }

    return config;
}

function genEntries() {
    var jsDir = path.resolve(srcDir, 'js');
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
