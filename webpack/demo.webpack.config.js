var path = require('path');
var webpack = require('webpack');

module.exports = {
    watch: true,
    entry: {
        demo: './demo/main.js',
        // vendor: ['vue', 'vue-resource']
    },
    output: {
        path: path.resolve('../demo'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /.vue$/,
                loader: 'eslint-loader',
                exclude: /node_modules/,
                options: {
                    fix: true
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                        // the "scss" and "sass" values for the lang attribute to the right configs here.
                        // other preprocessors should work out of the box, no loader config like this nessessary.
                        'less': 'vue-style-loader!css-loader!less-loader',
                        'scss': 'vue-style-loader!css-loader!sass-loader',
                        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                    }
                    // other vue-loader options go here
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.less$/,
                loader: 'style!css!less',
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: false,
        contentBase: path.join(__dirname, "../demo"),
        compress: true,
        port: 9000,
        watchContentBase: true,
        watchOptions:{
            poll: 500
        }
    },
    performance: {
        hints: false
    },
    // devtool: false
    devtool: '#eval-source-map',
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor'],
            minChunks: function (module) {
                // this assumes your vendor imports exist in the node_modules directory
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        })
    ]
};

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
}