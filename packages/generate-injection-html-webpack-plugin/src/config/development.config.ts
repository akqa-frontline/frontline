import { FrontlineGenerateInjectionHtmlWebpackPluginOptions } from "./FrontlineGenerateInjectionHtmlWebpackPlugin";

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
        })
    ].filter(Boolean)
});
