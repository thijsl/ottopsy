const webpack_rules = [];
module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: {
        extension: './src/index.js',
    },
    output: {
        filename: 'index.js',
        path: __dirname + '/extension/background/'
    },
    resolve: {
        extensions: [".js"]
    },
    module: {
        rules: webpack_rules
    }
};