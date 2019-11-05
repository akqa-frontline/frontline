import { FILE_REGEX, SVG_COMPONENT_REGEX } from "../utils/file-extension";
import { FrontlineJsConfigWebpackPluginOptions } from "../FrontlineJsConfigWebpackPlugin";
import TerserWebpackPlugin = require("terser-webpack-plugin");

export = (options: FrontlineJsConfigWebpackPluginOptions) => ({
    module: {
        rules: [
            {
                test: FILE_REGEX,
                exclude: [/[/\\\\]node_modules[/\\\\]/], // exclude node_modules folder per default
                use: [
                    {
                        loader: require.resolve("babel-loader"),
                        options: {
                            extends: options.babelConfigFile,
                            // cache builds, future builds attempt to read from cache to avoid needing to run expensive babel processings
                            // todo: disabled for now while heavy debugging is in the works
                            // cacheDirectory: true,
                            // do not include superfluous whitespace characters and line terminators
                            // https://babeljs.io/docs/en/babel-core/#options
                            compact: true,
                            ...(options.browserslistEnv && {
                                envName: options.browserslistEnv
                            })
                        }
                    }
                ]
            },
            {
                test: SVG_COMPONENT_REGEX,
                use: [
                    "@svgr/webpack",
                    {
                        loader: require.resolve("url-loader"),
                        options: {
                            // name: options.name,
                            limit: 10000 // 10bk - same as CRA
                        }
                    }
                ]
            }
        ]
    },
    plugins: [],
    optimization: {
        minimizer: [
            options.browserslistEnv === "modern" && [
                new TerserWebpackPlugin({
                    test: /\.js$/i,
                    terserOptions: {
                        ecma: 6 // This can be set to 7 or 8, too.
                    }
                })
            ]
        ].filter(Boolean)
    }
});
