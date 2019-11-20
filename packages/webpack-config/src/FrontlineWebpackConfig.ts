import {
    Configuration as WebpackConfiguration,
    Entry as WebpackEntry,
    EntryFunc as WebpackEntryFunc,
    Plugin as WebpackPlugin
} from "webpack";

import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
const path = require("path");
const fs = require("fs");
const HtmlWebpackEsmodulesPlugin = require("webpack-module-nomodule-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackAssetsManifest = require("webpack-assets-manifest");

const isEnvDevelopment = process.env.NODE_ENV === "development";
const isEnvProduction = process.env.NODE_ENV === "production";

const projectDirectory = fs.realpathSync(process.cwd());

export function FrontlineWebpackConfig(
    browserslistEnv: "legacy" | "modern",
    webpackConfig: WebpackConfiguration
): WebpackConfiguration {
    if (browserslistEnv !== "legacy" && browserslistEnv !== "modern") {
        throw new Error(
            'browserslistEnv argument must be "modern" or "legacy" - support for single envs is coming in a later release'
        );
    }

    const devServerConfig: WebpackDevServerConfiguration = {
        contentBase: path.join(projectDirectory, "dist"),
        host: "localhost",
        port: 8080,
        historyApiFallback: true,
        hot: true,
        inline: true,
        publicPath: "/",
        clientLogLevel: "none",
        open: true,
        overlay: true
    };

    const baseConfig: WebpackConfiguration = {
        context: path.resolve(projectDirectory, "./"),
        bail: isEnvProduction,
        devtool: isEnvProduction
            ? "hidden-source-map"
            : isEnvDevelopment && "cheap-module-source-map",

        plugins: [
            new HtmlWebpackPlugin({
                inject: true,
                template: "./public/index.html"
            })
        ],

        optimization: {
            minimize: isEnvProduction,
            splitChunks: {
                chunks: "all"
            },
            runtimeChunk: {
                name: (entrypoint: { name: string }): string =>
                    `runtime-${entrypoint.name}`
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
        entry: [
            ...(webpackConfig.entry as Array<
                string | string[] | WebpackEntry | WebpackEntryFunc
            >)
        ].filter(Boolean) as
            | string
            | string[]
            | WebpackEntry
            | WebpackEntryFunc,

        output: {
            path: path.resolve(projectDirectory, "dist"),
            filename: `js/[name].[hash:8].${browserslistEnv}.js`,
            chunkFilename: `js/[name].[hash:8].${browserslistEnv}.chunk.js`,
            publicPath: "/",

            ...webpackConfig.output
        },

        devServer: devServerConfig,

        plugins: [
            ...(baseConfig.plugins as WebpackPlugin[]),

            new HtmlWebpackEsmodulesPlugin(browserslistEnv),

            ...(webpackConfig.plugins as WebpackPlugin[]),

            isEnvProduction &&
                new BundleAnalyzerPlugin({
                    analyzerMode: "disabled",
                    openAnalyzer: false,
                    generateStatsFile: true,
                    statsFilename: `stats.${browserslistEnv}.json`
                }),

            isEnvProduction &&
                new WebpackAssetsManifest({
                    output: `manifest.${browserslistEnv}.json`
                })
        ].filter(Boolean) as WebpackPlugin[],

        optimization: {
            ...baseConfig.optimization,

            ...webpackConfig.optimization,

            minimize: isEnvProduction
        },

        resolve: {
            alias: {
                ...(isEnvDevelopment
                    ? { "react-dom": "@hot-loader/react-dom" }
                    : {})
            }
        },

        stats: {
            children: false
        }
    };
}
