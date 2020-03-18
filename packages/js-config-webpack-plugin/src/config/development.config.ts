import {
    JS_FILE_REGEX,
    TS_FILE_REGEX,
    SVG_COMPONENT_REGEX
} from "../utils/file-extension";
import { FrontlineJsConfigWebpackPluginOptions } from "./FrontlineJsConfigWebpackPlugin";

export = (options: FrontlineJsConfigWebpackPluginOptions) => ({
    module: {
        rules: [
            {
                test: JS_FILE_REGEX,
                exclude: [/[/\\\\]node_modules[/\\\\]/], // exclude node_modules folder per default
                use: [
                    {
                        loader: require.resolve("babel-loader"),
                        options: {
                            extends: options.babelConfigFile,
                            // cache builds, future builds attempt to read from cache to avoid needing to run expensive babel processings
                            cacheDirectory: true,
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
                test: TS_FILE_REGEX,
                exclude: [/[/\\\\]node_modules[/\\\\]/], // exclude node_modules folder per default
                use: [
                    {
                        loader: require.resolve("babel-loader"),
                        options: {
                            extends: options.babelConfigFile,
                            // cache builds, future builds attempt to read from cache to avoid needing to run expensive babel processings
                            cacheDirectory: true,
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
                        loader: require.resolve("file-loader")
                    }
                ]
            }
        ]
    },
    plugins: options.plugins
});
