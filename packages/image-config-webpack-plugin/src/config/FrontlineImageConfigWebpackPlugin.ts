import { Compiler, Plugin } from "webpack";

export interface FrontlineImageConfigWebpackPluginOptions {
    mode: "production" | "development" | "none";
    name: string;
}

const defaultOptions: Partial<FrontlineImageConfigWebpackPluginOptions> = {
    name: "static/media/[name].[hash:8].[ext]"
};

export class FrontlineImageConfigWebpackPlugin implements Plugin {
    options: Partial<FrontlineImageConfigWebpackPluginOptions>;

    constructor(options?: Partial<FrontlineImageConfigWebpackPluginOptions>) {
        this.options = Object.assign({}, defaultOptions, options);
    }

    apply(compiler: Compiler): void {
        // From https://github.com/webpack/webpack/blob/3366421f1784c449f415cda5930a8e445086f688/lib/WebpackOptionsDefaulter.js#L12-L14
        const isProductionLikeMode =
            this.options.mode !== undefined
                ? this.options.mode === "production"
                : compiler.options.mode === "production" ||
                  !compiler.options.mode;

        const config: {
            [key: string]: any;
            plugins: [Function];
        } = isProductionLikeMode
            ? require("./production.config")(
                  Object.assign({ mode: "production" }, this.options)
              )
            : require("./development.config")(
                  Object.assign({ mode: "development" }, this.options)
              );

        // Merge config
        config.plugins.forEach(plugin => plugin.apply(compiler));
        compiler.hooks.afterEnvironment.tap("ImageConfigWebpackPlugin", () => {
            compiler.options.module!.rules.push(...config.module.rules);
        });
    }
}
