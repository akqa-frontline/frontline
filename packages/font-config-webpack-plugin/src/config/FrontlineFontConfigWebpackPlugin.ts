import { Compiler, Plugin } from "webpack";

export interface FrontlineFontConfigWebpackPluginOptions {
    mode: "production" | "development" | "none";
    name: string;
}

const defualtOptions: Partial<FrontlineFontConfigWebpackPluginOptions> = {
    name: "static/media/[name].[hash:8].[ext]"
};

export class FrontlineFontConfigWebpackPlugin implements Plugin {
    options: Partial<FrontlineFontConfigWebpackPluginOptions>;

    constructor(options?: Partial<FrontlineFontConfigWebpackPluginOptions>) {
        this.options = Object.assign({}, defualtOptions, options);
    }

    apply(compiler: Compiler): void {
        // From https://github.com/webpack/webpack/blob/3366421f1784c449f415cda5930a8e445086f688/lib/WebpackOptionsDefaulter.js#L12-L14
        const isProductionLikeMode =
            this.options.mode !== undefined
                ? this.options.mode === "production"
                : compiler.options.mode === "production" ||
                  !compiler.options.mode;

        const config = isProductionLikeMode
            ? require("./production.config")(
                  Object.assign({ mode: "production" }, this.options)
              )
            : require("./development.config")(
                  Object.assign({ mode: "development" }, this.options)
              );

        // Merge config
        compiler.options.plugins!.push(...config.plugins);
        compiler.hooks.afterEnvironment.tap(
            "FrontlineFontConfigWebpackPlugin",
            () => {
                compiler.options.module!.rules.push(...config.module.rules);
            }
        );
    }
}
