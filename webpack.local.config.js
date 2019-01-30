var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

var config = require('./webpack.base.config.js');

config.entry = {
    'app': [
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        './static/assets/js/index'
    ]
};
config.mode = "development";

config.output.publicPath = 'http://localhost:3000/static/assets/bundles/deve/';
config.output.path = path.resolve(__dirname, './static/assets/bundles/deve/');

config.plugins = config.plugins.concat([
    new BundleTracker({filename: './webpack-stats.json'}),
    new webpack.HotModuleReplacementPlugin(),
]);

config.module.rules.push(
    {
        test: /\.css$/,
        use: [
            {loader: "style-loader"},
            {loader: "css-loader"},
        ]
    }
);
module.exports = config;