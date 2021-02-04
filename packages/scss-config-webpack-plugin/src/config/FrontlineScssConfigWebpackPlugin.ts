import { Compiler, Plugin } from "webpack";
import { cosmiconfigSync } from "cosmiconfig";
import { Options as SassOptions } from "sass";

export interface FrontlineScssWebpackPluginOptions {
    mode: "production" | "development" | "none";
    browserslistEnv: string;
    filename: string;
    chunkFilename: string;
    publicPath: string;

    sassOptions?: SassOptions;
    postCssConfigFile?: string;
}

// No defaults yet
const defaultOptions: Partial<FrontlineScssWebpackPluginOptions> = {
    publicPath: "../../"
};

export class FrontlineScssConfigWebpackPlugin implements Plugin {
    options: Partial<FrontlineScssWebpackPluginOptions>;

    constructor(options?: Partial<FrontlineScssWebpackPluginOptions>) {
        this.options = {
            ...defaultOptions,
            ...options
        };
    }

    resolvePostcssConfigFile(contextPath: string): string | null {
        const result = cosmiconfigSync("postcss").search(contextPath);

        if (result) {
            return result.filepath;
        }

        return null;
    }

    apply(compiler: Compiler): void {
        // From https://github.com/webpack/webpack/blob/3366421f1784c449f415cda5930a8e445086f688/lib/WebpackOptionsDefaulter.js#L12-L14
        const isProductionLikeMode =
            this.options.mode !== undefined
                ? this.options.mode === "production"
                : compiler.options.mode === "production" ||
                  !compiler.options.mode;

        const options = Object.assign({}, this.options, {
            postCssConfigFile: this.resolvePostcssConfigFile(compiler.context)
        });

        // Use compiler.options.output configuration also for css
        // Replace folder names called js and extends called js to css
        // E.g. 'js/x.[id].js' -> 'css/x.[id].css'
        const filename = (compiler.options.output!.filename! as string).replace(
            /(^|\/|\\|\.)js($|\/|\\)/g,
            "$1css$2"
        );
        const chunkFilename = compiler.options.output!.chunkFilename!.replace(
            /(^|\/|\\|\.)js($|\/|\\)/g,
            "$1css$2"
        );

        const config = isProductionLikeMode
            ? require("./production.config")(
                  Object.assign(
                      { filename, chunkFilename, mode: "production" },
                      options
                  )
              )
            : require("./development.config")(
                  Object.assign(
                      { filename, chunkFilename, mode: "development" },
                      options
                  )
              );

        // Merge config
        compiler.options.plugins!.push(...config.plugins);
        compiler.hooks.afterEnvironment.tap(
            "FrontlineScssWebpackPlugin",
            () => {
                compiler.options.module!.rules.push(...config.module.rules);
            }
        );
    }
}
