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
                            loader: MiniCssExtractPlugin.loader
                        },
                        {
                            loader: require.resolve("css-loader"),
                            options: {
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
                                sourceMap: false
                            }
                        },
                        {
                            loader: require.resolve("resolve-url-loader"),
                            options: {
                                sourceMap: false
                            }
                        },
                        {
                            loader: require.resolve("sass-loader"),
                            options: {
                                sourceMap: true,
                                sassOptions: {
                                    importer: [
                                        jsonImporter({
                                            ...(options.sassOptions
                                                ?.includePaths && {
                                                resolver: function(
                                                    dir: string,
                                                    url: string
                                                ): string {
                                                    return url.startsWith("~/")
                                                        ? path.resolve(
                                                              dir,
                                                              url.substr(2)
                                                          )
                                                        : path.resolve(
                                                              dir,
                                                              url
                                                          );
                                                }
                                            })
                                        }),
                                        globImporter()
                                    ],
                                    ...options.sassOptions
                                }
                            }
                        }
                    ]
                },
                {
                    test: FILE_MODULE_REGEX,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        {
                            loader: require.resolve("css-loader"),
                            options: {
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
                                sourceMap: false
                            }
                        },
                        {
                            loader: require.resolve("resolve-url-loader"),
                            options: {
                                sourceMap: false
                            }
                        },
                        {
                            loader: require.resolve("sass-loader"),
                            options: {
                                sourceMap: true,
                                sassOptions: {
                                    importer: [
                                        jsonImporter({
                                            ...(options.sassOptions
                                                ?.includePaths && {
                                                resolver: function(
                                                    dir: string,
                                                    url: string
                                                ): string {
                                                    return url.startsWith("~/")
                                                        ? path.resolve(
                                                              dir,
                                                              url.substr(2)
                                                          )
                                                        : path.resolve(
                                                              dir,
                                                              url
                                                          );
                                                }
                                            })
                                        }),
                                        globImporter()
                                    ],
                                    ...options.sassOptions
                                }
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
                cssProcessorOptions: {
                    parser: safeParser,
                    map: { inline: false, annotation: false }
                }
            })
        ]
    };
};
