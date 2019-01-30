var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var TerserPlugin = require('terser-webpack-plugin');
var config = require('./webpack.base.config.js');
var OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

config.output.path = path.resolve(__dirname, './static/assets/bundles/dist');
config.output.filename = "[name]-[hash].js";
config.mode = "production";
config.plugins = config.plugins.concat([
    new BundleTracker({filename: './webpack-stats-prod.json'}),
    // removes a lot of debugging code in React
    new webpack.optimize.OccurrenceOrderPlugin(),
    new TerserPlugin({
        parallel: true,
        terserOptions: {
            compress: true,
            output: {
                comments: false
            }
        }
    }),
    new MiniCssExtractPlugin({
        filename: "[name]-[hash].css",
        chunkFilename: "[id].css"
    }),
    new OptimizeCSSAssetsPlugin({})
]);


config.module.rules.push(
    {
        test: /\.css$/,
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
            },
            "css-loader"
        ]
    }
);

module.exports = config;