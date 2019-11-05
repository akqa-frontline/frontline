const path = require("path");

const {
    FrontlineScssConfigWebpackPlugin
} = require("@akqa-frontline/scss-config-webpack-plugin");
const {
    FrontlineJsConfigWebpackPlugin
} = require("@akqa-frontline/js-config-webpack-plugin");
const {
    FrontlineImageConfigWebpackPlugin
} = require("@akqa-frontline/image-config-webpack-plugin");
const {
    FrontlineFontConfigWebpackPlugin
} = require("@akqa-frontline/font-config-webpack-plugin");
const {
    FrontlineAssetConfigWebpackPlugin
} = require("@akqa-frontline/asset-config-webpack-plugin");

const { HotModuleReplacementPlugin } = require("webpack");

const HtmlWebpackEsmodulesPlugin = require("webpack-module-nomodule-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;

// TODO: TEMP
const rimraf = require("rimraf");
rimraf.sync("./dist");

const isEnvDevelopment = process.env.NODE_ENV === "development";
const isEnvProduction = process.env.NODE_ENV === "production";

const commonWebpackConfig = {
    context: path.resolve(__dirname, "./"),
    bail: isEnvProduction,
    devtool: isEnvProduction
        ? "hidden-source-map"
        : isEnvDevelopment && "cheap-module-source-map",
    entry: ["./src/styles/global.scss", "./src/index.js"],
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: "./public/index.html"
        }),

        new FrontlineImageConfigWebpackPlugin(),
        new FrontlineFontConfigWebpackPlugin(),
        new FrontlineAssetConfigWebpackPlugin()
    ],
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        host: "localhost",
        port: 8080,
        historyApiFallback: true,
        hot: true,
        inline: true,
        publicPath: "/",
        clientLogLevel: "none",
        open: true,
        overlay: true
    },
    optimization: {
        minimize: isEnvProduction,
        splitChunks: {
            chunks: "all"
        },
        runtimeChunk: {
            name: entrypoint => `runtime-${entrypoint.name}`
        }
    },
    stats: {
        children: false
    }
};

const legacyWebpackConfig = {
    ...commonWebpackConfig,

    name: "legacy-webpack",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "js/[name].[hash:8].legacy.js",
        chunkFilename: "js/[name].[hash:8].legacy.chunk.js",
        publicPath: "/"
    },
    plugins: [
        ...commonWebpackConfig.plugins,

        new HtmlWebpackEsmodulesPlugin("legacy"),

        new FrontlineScssConfigWebpackPlugin({ browserslistEnv: "legacy" }),
        new FrontlineJsConfigWebpackPlugin({ browserslistEnv: "legacy" }),

        isEnvDevelopment && new HotModuleReplacementPlugin(),

        isEnvProduction &&
            new BundleAnalyzerPlugin({
                analyzerMode: "disabled",
                openAnalyzer: false,
                generateStatsFile: true,
                statsFilename: "stats.legacy.json"
            })
    ].filter(Boolean)
};

const modernWebpackConfig = {
    ...commonWebpackConfig,

    name: "modern-webpack",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "js/[name].[hash:8].modern.js",
        chunkFilename: "js/[name].[hash:8].modern.chunk.js",
        publicPath: "/"
    },
    plugins: [
        ...commonWebpackConfig.plugins,

        new HtmlWebpackEsmodulesPlugin("modern"),

        new FrontlineScssConfigWebpackPlugin({ browserslistEnv: "modern" }),
        new FrontlineJsConfigWebpackPlugin({ browserslistEnv: "modern" }),

        isEnvDevelopment && new HotModuleReplacementPlugin(),

        isEnvProduction &&
            new BundleAnalyzerPlugin({
                analyzerMode: "disabled",
                openAnalyzer: false,
                generateStatsFile: true,
                statsFilename: "stats.modern.json"
            })
    ].filter(Boolean)
};

module.exports = [legacyWebpackConfig, modernWebpackConfig];
