const backgroundConfig = {
    mode: "development",
    devtool: "inline-source-map",
    entry: {
        extension: './src/webpack-index/background.js',
    },
    output: {
        filename: 'index.js',
        path: __dirname + '/extension/background/'
    },
    resolve: {
        extensions: [".js"]
    }
};

const popupConfig = {
    mode: "development",
    devtool: "inline-source-map",
    entry: {
        extension: './src/webpack-index/popup.js',
    },
    output: {
        filename: 'popup.js',
        path: __dirname + '/extension/page_action/'
    },
    resolve: {
        extensions: [".js"]
    }
};

module.exports = [backgroundConfig, popupConfig];