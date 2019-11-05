import { FrontlineScssWebpackPluginOptions } from "./FrontlineScssConfigWebpackPlugin";

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const autoprefixer = require("autoprefixer");
const jsonImporter = require("node-sass-json-importer");
const globImporter = require("node-sass-glob-importer");
const safeParser = require("postcss-safe-parser");
const path = require("path");

import { FILE_MODULE_REGEX, FILE_REGEX } from "../utils/file-extension";

export = (options: FrontlineScssWebpackPluginOptions) => {
    return {
        module: {
            rules: [
                {
                    test: FILE_REGEX,
                    exclude: FILE_MODULE_REGEX,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                // The css file will be probably be placed in a sub directory.
                                // To prevent invalid ressource urls this additional sub folder
                                // has to be taken into account for the relative path calculation
                                publicPath: (
                                    path.relative(
                                        path.dirname(options.filename),
                                        "."
                                    ) + path.sep
                                ).replace(/^[\\\/]$/, "")
                            }
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
                                importer: [jsonImporter(), globImporter()]
                            }
                        }
                    ]
                },
                {
                    test: FILE_MODULE_REGEX,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                // The css file will be probably be placed in a sub directory.
                                // To prevent invalid ressource urls this additional sub folder
                                // has to be taken into account for the relative path calculation
                                publicPath: (
                                    path.relative(
                                        path.dirname(options.filename),
                                        "."
                                    ) + path.sep
                                ).replace(/^[\\\/]$/, "")
                            }
                        },
                        {
                            loader: require.resolve("css-loader"),
                            options: {
                                sourceMap: true,
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
                                importer: [jsonImporter(), globImporter()]
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            // Extract css to a custom file
            new MiniCssExtractPlugin({
                filename: options.filename,
                chunkFilename: options.chunkFilename
            }),
            // Minify css - but use only safe css-nano transformations
            // https://github.com/facebook/create-react-app/pull/4706
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: { parser: safeParser, safe: true }
            })
        ]
    };
};
