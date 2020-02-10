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

const { FrontlineWebpackConfig } = require("@akqa-frontline/webpack-config");

const modernWebpackConfig = FrontlineWebpackConfig("modern", {
    plugins: [
        new FrontlineImageConfigWebpackPlugin(),
        new FrontlineFontConfigWebpackPlugin(),
        new FrontlineAssetConfigWebpackPlugin(),
        new FrontlineScssConfigWebpackPlugin({ browserslistEnv: "modern" }),
        new FrontlineJsConfigWebpackPlugin({ browserslistEnv: "modern" })
    ]
});

module.exports = [modernWebpackConfig];
