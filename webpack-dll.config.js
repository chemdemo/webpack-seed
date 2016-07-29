/*
* @Author: dmyang
* @Date:   2016-07-29 17:04:42
* @Last Modified by:   dmyang
* @Last Modified time: 2016-07-29 19:20:01
*/

'use strict'

const path = require('path')

const webpack = require('webpack')

const srcDir = path.resolve(process.cwd(), 'src')
const assets = path.resolve(process.cwd(), 'assets')

const lib = ['react', 'react-dom']

module.exports = {
    // context: process.cwd(),

    entry: {
        lib: lib
    },

    output: {
        path: path.join(srcDir, 'dll', 'js'),
        filename: '[name].js',
        library: '[name]_[chunkhash]'
    },

    plugins: [
        new webpack.DllPlugin({
            context: process.cwd(),
            path: path.join(srcDir, 'dll', 'js', '[name]-manifest.json'),
            name: '[name]_[chunkhash]'
        })
    ]
}
