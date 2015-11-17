'use strict';

const path = require('path');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const pkg = require('./package.json');
const Clean = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const TARGET = process.env.npm_lifecycle_event;
const ROOT_PATH = path.resolve(__dirname);
const APP_PATH = path.resolve(ROOT_PATH, 'src');
const BUILD_PATH = path.resolve(ROOT_PATH, 'build');

process.env.BABEL_ENV = TARGET;

var common = {
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
};

if(TARGET === 'start' || !TARGET) {

  module.exports = merge(common, {
    entry: APP_PATH,
    output: {
      path: BUILD_PATH,
      filename: 'bundle.js',
    },
    devtool: 'eval-source-map',
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      // parse host and port from env so this is easy to customize
      host: process.env.HOST,
      port: process.env.PORT,
    },
    module: {
      preLoaders: [
        {test: /\.jsx?$/, loader: 'eslint-loader', include: APP_PATH },
      ],
      loaders: [
        { test: /\.css$/, loaders: ['style', 'css'], include: APP_PATH },
        { test: /\.jsx?$/, loaders: ['react-hot', 'babel'], include: APP_PATH },
      ],
    },
    plugins: [
      new HtmlwebpackPlugin({ title: 'Redux Boilerplate' }),
      new webpack.HotModuleReplacementPlugin(),
    ],
  });

}

if ( TARGET === 'build' || TARGET === 'stats' || (/^deploy.*$/.test(TARGET)) ) {

  module.exports = merge(common, {
    devtool: 'source-map',
    entry: {
      app: APP_PATH,
      vendor: Object.keys(pkg.dependencies),
    },
    output: {
      path: BUILD_PATH,
      filename: '[name].[chunkhash].js?',
    },
    module: {
      loaders: [
        { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css'), include: APP_PATH },
        { test: /\.jsx?$/, loaders: ['babel'], include: APP_PATH },
      ],
    },
    plugins: [
      new Clean(['build']), // clean build previous builds
      new ExtractTextPlugin('styles.[chunkhash].css'), // separate styles of app.js
      new webpack.optimize.CommonsChunkPlugin( 'vendor', '[name].[chunkhash].js' ), // separate vendor and app
      new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': JSON.stringify('production') } }), // more minification
      new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }), // minification
    ],
  });

}
