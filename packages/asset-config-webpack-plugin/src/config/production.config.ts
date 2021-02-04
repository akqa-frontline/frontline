const CopyPlugin = require("copy-webpack-plugin");

export = () => ({
    module: {
        rules: []
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: "./public",
                    to: "./",
                    globOptions: {
                        // html files is controlled by html-webpack-plugin in our webpack-config
                        ignore: ["*.html"]
                    }
                }
            ]
        })
    ]
});
