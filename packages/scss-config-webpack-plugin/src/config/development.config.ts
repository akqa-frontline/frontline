import { FrontlineScssWebpackPluginOptions } from "./FrontlineScssConfigWebpackPlugin";

import { FILE_MODULE_REGEX, FILE_REGEX } from "../utils/file-extension";
import { FrontlinePostcssConfig } from "./FrontlinePostcssConfig";
import { FrontlineNodeSassConfig } from "./FrontlineNodeSassConfig";

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
                        loader: require.resolve("resolve-url-loader")
                    },
                    {
                        loader: require.resolve("sass-loader"),
                        options: FrontlineNodeSassConfig(options.sassOptions)
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
                            modules: {
                                localIdentName: "[path][name]__[local]"
                            }
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
                        loader: require.resolve("resolve-url-loader")
                    },
                    {
                        loader: require.resolve("sass-loader"),
                        options: FrontlineNodeSassConfig(options.sassOptions)
                    }
                ]
            }
        ]
    },
    plugins: []
});
