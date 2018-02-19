var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

var config = require('./webpack.base.config.js');


// Use webpack dev server

config.output.path = require('path').resolve('./static/assets/bundles/deve');

// Add HotModuleReplacementPlugin and BundleTracker plugins
config.plugins = config.plugins.concat([
    new BundleTracker({filename: './webpack-stats.json'}),
]);

// Add a loader for JSX files with react-hot enabled
config.module.loaders.push(
    {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/},
    {test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/}
);

module.exports = config;