import { FrontlineFontConfigWebpackPluginOptions } from "./FrontlineFontConfigWebpackPlugin";

export = (options: FrontlineFontConfigWebpackPluginOptions) => ({
    module: {
        rules: [
            {
                test: /\.(eot|ttf|woff|woff2)([?#]+[A-Za-z0-9-_]*)*$/,
                use: {
                    loader: require.resolve("file-loader"),
                    options: {
                        name: options.name
                    }
                }
            }
        ]
    },
    plugins: []
});
