import { FrontlineGenerateInjectionHtmlWebpackPluginOptions } from "./FrontlineGenerateInjectionHtmlWebpackPlugin";
import HtmlWebpackEsModulesPlugin from "webpack-module-nomodule-plugin";

const HtmlWebpackPlugin = require("html-webpack-plugin");

export = (options: FrontlineGenerateInjectionHtmlWebpackPluginOptions) => ({
    module: {
        rules: []
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "root.generated.html",
            inject: false,
            template: options.template
        }),

        new HtmlWebpackEsModulesPlugin(options.browserslistEnv)
    ].filter(Boolean)
});
