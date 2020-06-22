import { FrontlineScssWebpackPluginOptions } from "./FrontlineScssConfigWebpackPlugin";

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const safeParser = require("postcss-safe-parser");

import { FILE_MODULE_REGEX, FILE_REGEX } from "../utils/file-extension";
import { FrontlinePostcssConfig } from "./FrontlinePostcssConfig";
import { FrontlineNodeSassConfig } from "./FrontlineNodeSassConfig";

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
                            // css is located in `static/css`, use '../../' to locate index.html folder
                            options: { publicPath: options.publicPath }
                        },
                        {
                            loader: require.resolve("css-loader"),
                            options: {
                                importLoaders: 3
                            }
                        },
                        {
                            loader: require.resolve("postcss-loader"),
                            options:
                                options.postCssConfigFile !== null
                                    ? {
                                          config: {
                                              path: options.postCssConfigFile
                                          }
                                      }
                                    : FrontlinePostcssConfig(
                                          options.browserslistEnv
                                      )
                        },
                        {
                            loader: require.resolve("resolve-url-loader"),
                            options: {
                                sourceMap: false
                            }
                        },
                        {
                            loader: require.resolve("sass-loader"),
                            options: FrontlineNodeSassConfig(
                                options.sassOptions
                            )
                        }
                    ]
                },
                {
                    test: FILE_MODULE_REGEX,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            // css is located in `static/css`, use '../../' to locate index.html folder
                            options: { publicPath: options.publicPath }
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
                            options:
                                options.postCssConfigFile !== null
                                    ? {
                                          config: {
                                              path: options.postCssConfigFile
                                          }
                                      }
                                    : FrontlinePostcssConfig(
                                          options.browserslistEnv
                                      )
                        },
                        {
                            loader: require.resolve("resolve-url-loader"),
                            options: {
                                sourceMap: false
                            }
                        },
                        {
                            loader: require.resolve("sass-loader"),
                            options: FrontlineNodeSassConfig(
                                options.sassOptions
                            )
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
