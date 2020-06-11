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
const {
    FrontlineGenerateInjectionHtmlWebpackPlugin
} = require("@akqa-frontline/generate-injection-html-webpack-plugin");

const { FrontlineWebpackConfig } = require("@akqa-frontline/webpack-config");

const isDevelopment = process.env.NODE_ENV === "development";

const frontlineWebpackConfigOptions = {
    outputMode: "minimal"
};

const sassOptions = {
    includePaths: [path.resolve(__dirname, "./src")]
};

const webpackEntry = {
    main: "./src/index.tsx",
    styles: "./src/styles/global.scss"
};

const sharedWebpackPlugins = [
    new FrontlineImageConfigWebpackPlugin(),
    new FrontlineFontConfigWebpackPlugin(),
    new FrontlineAssetConfigWebpackPlugin()
];

const sharedWebpackConfig = {
    devServer: {
        port: 8888
    },
    resolve: {
        alias: {
            "~": path.join(__dirname, "./src")
        }
    }
};

const legacyWebpackConfig = FrontlineWebpackConfig(
    "legacy",
    {
        entry: webpackEntry,
        plugins: [
            ...sharedWebpackPlugins,
            new FrontlineScssConfigWebpackPlugin({
                browserslistEnv: "legacy",
                sassOptions
            }),
            new FrontlineJsConfigWebpackPlugin({ browserslistEnv: "legacy" }),
            new FrontlineGenerateInjectionHtmlWebpackPlugin({
                browserslistEnv: "legacy",
                outputMode: "minimal"
            })
        ],
        ...sharedWebpackConfig
    },
    frontlineWebpackConfigOptions
);

const modernWebpackConfig = FrontlineWebpackConfig(
    "modern",
    {
        entry: webpackEntry,
        plugins: [
            ...sharedWebpackPlugins,
            new FrontlineScssConfigWebpackPlugin({
                browserslistEnv: "modern",
                sassOptions
            }),
            new FrontlineJsConfigWebpackPlugin({ browserslistEnv: "modern" }),
            new FrontlineGenerateInjectionHtmlWebpackPlugin({
                browserslistEnv: "modern",
                outputMode: "minimal"
            })
        ],
        ...sharedWebpackConfig
    },
    frontlineWebpackConfigOptions
);

module.exports = isDevelopment
    ? modernWebpackConfig
    : [modernWebpackConfig, legacyWebpackConfig];
