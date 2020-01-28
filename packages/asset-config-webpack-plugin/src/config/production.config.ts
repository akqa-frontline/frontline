const CopyPlugin = require("copy-webpack-plugin");

export = () => ({
    module: {
        rules: []
    },
    plugins: [
        new CopyPlugin([
            {
                from: "./public",
                to: "./"
            }
        ])
    ]
});
