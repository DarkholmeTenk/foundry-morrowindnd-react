const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');
const ReactRefreshTypeScript = require('react-refresh-typescript');

module.exports = (env, argv) => {
    let dev = argv.mode === "development"
    let babelLoader = {
        loader: 'babel-loader',
        options: {
            presets: [["@babel/preset-react", {"runtime": "automatic"}]],
            plugins: ["@babel/plugin-proposal-class-properties", dev && require.resolve('react-refresh/babel')].filter(Boolean)
        }
    }
    let loaders = [babelLoader]

    return {
        entry: path.resolve(__dirname, './src/index.js'),
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: loaders,
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: ["style-loader", "css-loader", "sass-loader"],
                },
                {
                    test: /\.tsx?$/,
                    use: [babelLoader, {
                        loader: 'ts-loader',
                        /*options: {
                            getCustomTransformers: () => ({
                                before: dev ? [ReactRefreshTypeScript()] : [],
                            })
                        }*/
                    }]
                }
            ],
        },
        plugins: [
            dev && new webpack.HotModuleReplacementPlugin(),
            dev && new ReactRefreshWebpackPlugin({overlay: false, }),
        ].filter(Boolean),
        resolve: {
            extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
        },
        output: {
            path: path.resolve(__dirname, './dist'),
            publicPath: 'http://localhost:8080/',
            filename: 'bundle.js',
            library: "MorrowinDnD"
        },
        devServer: {
            contentBase: path.resolve(__dirname, './dist'),
            hot: true,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
            }
        },
        devtool: "source-map",
        optimization: {
            minimize: !dev,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        keep_classnames: true,
                        mangle: {
                            keep_classnames: true,
                        }
                    }
                })
            ]
        }
    }
};