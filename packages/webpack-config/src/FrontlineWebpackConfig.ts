import {
    Configuration as WebpackConfiguration,
    DefinePlugin,
    Plugin as WebpackPlugin
} from "webpack";

import path from "path";
import HtmlWebpackEsModulesPlugin from "webpack-module-nomodule-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
import WebpackAssetsManifest, { FileDescriptor } from "webpack-manifest-plugin";
import InterpolateHtmlPlugin from "react-dev-utils/InterpolateHtmlPlugin";
import FixStyleOnlyEntriesPlugin from "webpack-fix-style-only-entries";

import paths from "./paths";
import getClientEnvironment from "./env";

import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const isEnvDevelopment = process.env.NODE_ENV === "development";
const isEnvProduction = process.env.NODE_ENV === "production";

const publicPath = isEnvProduction ? paths.servedPath : "/";

const manifest: { modern?: any; legacy?: any } = {};

interface FrontlineWebpackConfigOptions {
    outputMode?: "efficient" | "minimal";
    generateHTML?: boolean;
}

const defaultOptions: FrontlineWebpackConfigOptions = {
    generateHTML: true,
    outputMode: "efficient"
};

export function FrontlineWebpackConfig(
    browserslistEnv: "legacy" | "modern",
    webpackConfig: WebpackConfiguration,
    config?: FrontlineWebpackConfigOptions
): WebpackConfiguration {
    if (browserslistEnv !== "legacy" && browserslistEnv !== "modern") {
        throw new Error(
            'browserslistEnv argument must be "modern" or "legacy" - support for single envs is coming in a later release'
        );
    }

    const _config = Object.assign({}, defaultOptions, config);

    // `publicUrl` is just like `publicPath`, but we will provide it to our app
    // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
    // Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
    const publicUrl = isEnvProduction
        ? publicPath.slice(0, -1)
        : isEnvDevelopment && "";
    const env = getClientEnvironment(publicUrl as string);

    const devServerConfig: WebpackDevServerConfiguration = {
        compress: true,
        ...(_config.generateHTML && {
            contentBase: paths.appPublic,
            watchContentBase: true
        }),
        hot: true,
        publicPath: "/",
        host: "localhost",
        port: 8080,
        historyApiFallback: true,
        open: true,
        overlay: true,

        ...webpackConfig.devServer
    };

    const baseConfig: WebpackConfiguration = {
        bail: isEnvProduction,
        devtool: isEnvProduction
            ? "hidden-source-map"
            : isEnvDevelopment && "cheap-module-source-map",

        optimization: {
            minimize: isEnvProduction,
            splitChunks: {
                chunks: "all",
                name: false
            },
            runtimeChunk: {
                // dont generate runtime chunks for CSS entries
                name: (entrypoint: { name: string }): string | boolean =>
                    entrypoint.name.indexOf("css") > -1
                        ? false
                        : `runtime-${entrypoint.name}`
            }
        },

        stats: {
            children: false
        }
    };

    return {
        ...(baseConfig as WebpackConfiguration),
        ...(webpackConfig as WebpackConfiguration),

        name: `${browserslistEnv}-webpack`,

        ...(webpackConfig.entry && {
            entry: webpackConfig.entry as string | string[] | any
        }),

        output: {
            path: paths.appBuild,
            pathinfo: isEnvDevelopment,
            // There will be one main bundle, and one file per asynchronous chunk.
            // In development, it does not produce real files.
            filename: isEnvProduction
                ? `static/js/[name].${browserslistEnv}.[contenthash:8].js`
                : `static/js/[name].${browserslistEnv}.js`,

            chunkFilename: isEnvProduction
                ? `static/js/[name].${browserslistEnv}.[contenthash:8].chunk.js`
                : `static/js/[name].${browserslistEnv}.chunk.js`,

            publicPath: publicPath,

            // Point sourcemap entries to original disk location (format as URL on Windows)
            devtoolModuleFilenameTemplate: isEnvProduction
                ? info =>
                      path
                          .relative(paths.appSrc, info.absoluteResourcePath)
                          .replace(/\\/g, "/")
                : info =>
                      path
                          .resolve(info.absoluteResourcePath)
                          .replace(/\\/g, "/"),

            ...webpackConfig.output
        },

        devServer: devServerConfig,

        plugins: [
            ...(_config.generateHTML
                ? [
                      new HtmlWebpackPlugin({
                          inject: true,
                          template: "./public/index.html",
                          minify: isEnvProduction
                              ? {
                                    removeComments: true,
                                    collapseWhitespace: true,
                                    removeRedundantAttributes: true,
                                    useShortDoctype: true,
                                    removeEmptyAttributes: true,
                                    removeStyleLinkTypeAttributes: true,
                                    keepClosingSlash: true,
                                    minifyJS: true,
                                    minifyCSS: true,
                                    minifyURLs: true
                                }
                              : undefined
                      }),
                      new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw)
                  ]
                : []),
            new DefinePlugin(env.stringified),
            // Only generate module / no module blocks in index.html, in production
            isEnvProduction &&
                _config.generateHTML &&
                new HtmlWebpackEsModulesPlugin(
                    browserslistEnv,
                    _config.outputMode
                ),

            // Remove JS for CSS only entrypoints ({entry: "styles.css"})
            isEnvProduction && new FixStyleOnlyEntriesPlugin(),

            ...(webpackConfig.plugins ? (webpackConfig.plugins as any) : []),

            isEnvProduction &&
                new BundleAnalyzerPlugin({
                    analyzerMode: "disabled",
                    openAnalyzer: false,
                    generateStatsFile: true,
                    statsFilename: `stats.${browserslistEnv}.json`
                }),

            isEnvProduction &&
                new WebpackAssetsManifest({
                    fileName: "asset-manifest.json",
                    publicPath: publicPath,
                    seed: manifest,
                    generate: (seed, files, entrypoints) => {
                        if (!manifest.hasOwnProperty(browserslistEnv)) {
                            manifest[
                                browserslistEnv === "modern"
                                    ? "modern"
                                    : "legacy"
                            ] = {};
                        }

                        const manifestFiles = files.reduce(
                            (
                                manifest: { [key: string]: string },
                                file: FileDescriptor
                            ) => {
                                manifest[`${file.name}`] = file.path as string;
                                return manifest;
                            },
                            {}
                        );

                        const entrypointFiles: {
                            [key: string]: Array<string>;
                        } = {};

                        Object.keys(entrypoints).forEach(k => {
                            entrypointFiles[k] = entrypoints[k].filter(
                                fileName => !fileName.endsWith(".map")
                            );
                        });

                        manifest[browserslistEnv].files = manifestFiles;
                        manifest[browserslistEnv].entrypoints = entrypointFiles;

                        return manifest;
                    }
                })
        ].filter(Boolean) as WebpackPlugin[],

        optimization: {
            ...baseConfig.optimization,

            ...webpackConfig.optimization,

            minimize: isEnvProduction
        },

        resolve: {
            alias: {
                "react-dom": "@hot-loader/react-dom",
                ...(webpackConfig.resolve && { ...webpackConfig.resolve.alias })
            }
        },

        stats: {
            children: false
        }
    };
}
