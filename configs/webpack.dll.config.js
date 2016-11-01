/*
* @Author: dmyang
* @Date:   2016-07-29 17:04:42
* @Last Modified by:   dmyang
* @Last Modified time: 2016-09-22 20:11:53
*/

'use strict'

const path = require('path')

const webpack = require('webpack')

const srcDir = path.resolve(process.cwd(), 'src')
const assets = path.resolve(process.cwd(), 'assets')

const reactStuff = ['react', 'react-dom']
const zStuff = ['../src/js/lib/zepto.js']

module.exports = {
    // context: process.cwd(),

    entry: {
        reactStuff,
        // zStuff
    },

    output: {
        path: path.join(assets, 'dll', 'js'),
        filename: '[name].js',
        library: '[name]_[chunkhash:8]',
        // libraryTarget: 'commonjs2'
        libraryTarget: 'this'
    },

    plugins: [
        new webpack.DllPlugin({
            context: process.cwd(),
            path: path.join(assets, 'dll', 'js', '[name]-manifest.json'),
            name: '[name]_[chunkhash:8]'
        })
    ]
}
