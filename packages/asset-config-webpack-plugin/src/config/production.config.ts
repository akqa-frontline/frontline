const CopyPlugin = require("copy-webpack-plugin");

export = () => ({
    module: {
        rules: []
    },
    plugins: [
        new CopyPlugin(
            [
                {
                    from: "public/**/*",
                    to: "",
                    flatten: true
                },
                {
                    from: "src/assets/**/*",
                    to: "static/media/",
                    flatten: true
                }
            ],
            {
                ignore: [
                    // All these files are handled by specific plugins
                    "*.js",
                    "*.jsx",
                    "*.css",
                    "*.scss",
                    "*.gif",
                    "*.jpg",
                    "*.jpeg",
                    "*.png",
                    "*.svg",
                    "*.eot",
                    "*.woff",
                    "*.woff2",
                    "*.html"
                ]
            }
        )
    ]
});
