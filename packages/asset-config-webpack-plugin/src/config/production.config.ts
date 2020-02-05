const CopyPlugin = require("copy-webpack-plugin");

export = () => ({
    module: {
        rules: []
    },
    plugins: [
        new CopyPlugin([
            {
                from: "./public",
                to: "./",
                // html files is controlled by html-webpack-plugin in our webpack-config
                ignore: ["*.html"]
            }
        ])
    ]
});
