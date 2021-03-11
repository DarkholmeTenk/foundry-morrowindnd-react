const path = require('path');

module.exports = (env, argv) => {
    let dev = argv.mode === "development"
    let babelLoader = {
        loader: 'babel-loader',
        options: {
            presets: [["@babel/preset-react", {"runtime": "automatic"}]],
            plugins: []
        }
    }
    let loaders = [babelLoader]
    if(dev) {
        babelLoader.options.plugins.push("react-hot-loader/babel")
        loaders.push({loader: 'react-hot-loader-loader'})
    }

    return {
        entry: path.resolve(__dirname, './src/index.js'),
        module: {
            rules: [
                {
                    test: /\.(js)$/,
                    exclude: /node_modules/,
                    use: [babelLoader],
                },
                {
                    test: /\.(jsx)$/,
                    exclude: /node_modules/,
                    use: loaders,
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: ["style-loader", "css-loader", "sass-loader"],
                },
                {
                    test: /\.tsx?$/,
                    loader: 'awesome-typescript-loader'
                }
            ],
        },
        resolve: {
            extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
        },
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: 'bundle.js'
        },
        devServer: {
            contentBase: path.resolve(__dirname, './dist'),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
            }
        },
        devtool: "source-map",
        externals: [{"react": "React", "react-dom": "ReactDOM", "@reduxjs/toolkit": "RTK"}, function({context, request, contextInfo, getResolve}, callback) {
            if( /^.*darkholme\/foundry-react-core.*$/.test(request)) {
                let secondBit = request.match(/^.*darkholme\/foundry-react-core(.*)$/)[1].split("/").filter(x=>x !== "src")
                secondBit[0] = "FoundryReactCore"
                console.log("Mapping FRC", request, secondBit)
                return callback(null, secondBit)
            } else {
                return callback()
            }
        }]
    }
};