var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    target: 'atom',
    entry: {
        app: './app/app.js',
    },
    output: {
        path: './build',
        filename: '[name].js',
    },
    module: {
        preLoaders: [{
            test: /\.vue$/,
            loader: 'eslint',
            exclude: /node_modules/
        }, {
            test: /\.js$/,
            loader: 'eslint',
            exclude: /node_modules/
        }],
        loaders: [{
            test: /\.vue$/,
            loader: 'vue'
        }, {
            test: /\.css$/,
            loaders: ExtractTextPlugin.extract("style", "css")
        }, {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel'
        }, {
            test: /\.json$/,
            loader: 'json'
        }]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new ExtractTextPlugin('app.css')
    ],
    eslint: {
        formatter: require('eslint-friendly-formatter')
    },
    vue: {
        loaders: {
            css: ExtractTextPlugin.extract("css")
        }
    }
}
