import { FrontlineScssWebpackPluginOptions } from "./FrontlineScssConfigWebpackPlugin";

const autoprefixer = require("autoprefixer");
const jsonImporter = require("node-sass-json-importer");
const globImporter = require("node-sass-glob-importer");

import { FILE_MODULE_REGEX, FILE_REGEX } from "../utils/file-extension";

export = (options: FrontlineScssWebpackPluginOptions) => ({
    module: {
        rules: [
            {
                test: FILE_REGEX,
                exclude: FILE_MODULE_REGEX,
                use: [
                    {
                        loader: require.resolve("style-loader")
                    },
                    {
                        loader: require.resolve("css-loader"),
                        options: {
                            sourceMap: true,
                            importLoaders: 3
                        }
                    },
                    {
                        loader: require.resolve("postcss-loader"),
                        options: {
                            plugins: (loader: any) => [
                                require("postcss-flexbugs-fixes"),
                                autoprefixer({
                                    // flexbox: "no-2009" will add prefixes only for final and IE versions of specification.
                                    // @see https://github.com/postcss/autoprefixer#disabling
                                    flexbox: "no-2009",
                                    env: options.browserslistEnv
                                }),
                                require("iconfont-webpack-plugin")({
                                    resolve: loader.resolve
                                })
                            ],
                            sourceMap: true
                        }
                    },
                    {
                        loader: require.resolve("resolve-url-loader")
                    },
                    {
                        loader: require.resolve("sass-loader"),
                        options: {
                            sourceMap: true,
                            sassOptions: {
                                importer: [jsonImporter(), globImporter()]
                            }
                        }
                    }
                ]
            },
            {
                test: FILE_MODULE_REGEX,
                use: [
                    {
                        loader: require.resolve("style-loader")
                    },
                    {
                        loader: require.resolve("css-loader"),
                        options: {
                            sourceMap: false,
                            importLoaders: 3,
                            modules: true
                        }
                    },
                    {
                        loader: require.resolve("postcss-loader"),
                        options: {
                            plugins: (loader: any) => [
                                require("postcss-flexbugs-fixes"),
                                autoprefixer({
                                    // flexbox: "no-2009" will add prefixes only for final and IE versions of specification.
                                    // @see https://github.com/postcss/autoprefixer#disabling
                                    flexbox: "no-2009",
                                    env: options.browserslistEnv
                                }),
                                require("iconfont-webpack-plugin")({
                                    resolve: loader.resolve
                                })
                            ],
                            sourceMap: true
                        }
                    },
                    {
                        loader: require.resolve("resolve-url-loader")
                    },
                    {
                        loader: require.resolve("sass-loader"),
                        options: {
                            sourceMap: true,
                            sassOptions: {
                                importer: [jsonImporter(), globImporter()]
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: []
});
