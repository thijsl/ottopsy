const webpack_rules = [];
let babelLoader = {
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
        loader: "babel-loader",
        options: {
            presets: ["@babel/preset-env"]
        }
    }
};
// webpack_rules.push(babelLoader);
module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: {
        extension: './src/index.js',
    },
    output: {
        filename: 'index.js',
        path: __dirname + '/'
    },
    resolve: {
        extensions: [".js"]
    },
    module: {
        rules: webpack_rules
    }
};