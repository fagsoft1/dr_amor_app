var path = require('path');
module.exports = {
    externals: [
        {'./cptable': 'var cptable'},
        {'./jszip': 'jszip'}
    ],
    node: {fs: 'empty'},
    context: __dirname,
    entry: {
        'app': './static/assets/js/index'
    },
    output: {
        path: path.resolve(__dirname, './static/assets/bundles/'),
        filename: "[name]-[hash].js"
    },
    plugins: [],
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.(gif|ttf|eot|svg|woff2?)$/,
                use: ['url-loader?name=[name].[ext]'],
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
};