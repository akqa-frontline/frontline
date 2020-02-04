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
                // index.html is controlled by html-webpack-plugin in our webpack-config
                ignore: ["index.html"]
            }
        ])
    ]
});
