const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: 'development',
    output: {
        publicPath: './',
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Output Management'
        }),

        new CleanWebpackPlugin(['dist'])
    ],
};
