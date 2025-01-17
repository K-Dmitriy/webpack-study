const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    };

    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetWebpackPlugin(),
            new TerserWebpackPlugin()
        ];
    }

    return config;
};

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const cssLoaders = extra => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: isDev,
                reloadAll: true
            },
        },
        'css-loader'
    ];

    if (extra) {
        loaders.push(extra);
    }

    return loaders;
};

const babelOptions = preset => {
    const options = {
        presets: [
            '@babel/preset-env'
        ],
        plugins: ['@babel/plugin-proposal-class-properties']
    };
    
    if (preset) {
        options.presets.push(preset);
    }

    return options;
};

const jsLoaders = () => {
    const loaders = [{
        loader: 'babel-loader',
        options: babelOptions()
    }];

    if (isDev) {
        loaders.push('eslint-loader')
    }

    return loaders;
}

const plugins = () => {
    const base = [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [{
                from: path.resolve(__dirname, 'src/favicon.ico'),
                to: path.resolve(__dirname, 'dist')
            }]
        }),
        new MiniCssExtractPlugin({
            filename: filename('css')
        })
    ];

    if (isProd) {
        base.push(new WebpackBundleAnalyzer());
    }

    return base;
};

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: ['@babel/polyfill', './index.jsx'],
        analytics: './analytics.ts'
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.json', '.png'],
        alias: {
            '@models': path.resolve(__dirname, 'src/models'),
            '@': path.resolve(__dirname, 'src'),
        }
    },
    optimization: optimization(),
    devServer: {
        port: 4200,
        hot: isDev
    },
    devtool: isDev ? 'source-map' : '',
    plugins: plugins(),
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.less$/,
                use: cssLoaders('less-loader')
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.xml$/,
                use: ['xml-loader']
            },
            {
                test: /\.csv$/,
                use: ['csv-loader']
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            },
            {
                test: /\.m?jsx$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: babelOptions('@babel/preset-react')
                }
            },
            {
                test: /\.m?ts$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: babelOptions('@babel/preset-typescript')
                }
            }
        ]
    }
};