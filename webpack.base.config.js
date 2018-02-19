var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

///npm run run:local

module.exports = {
    context: __dirname,
    entry: {
        //'admin_usuarios': './static/assets/js/admin_usuarios/index',
        'app': './static/assets/js/index'
        //'programador_modelos': './static/assets/js/programador_modelos/index'
    },
    output: {
        path: path.resolve('./static/assets/bundles/'),
        filename: "[name].js"
        //filename: "[name]-[hash].js"
    },
    plugins: [],
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    }
};