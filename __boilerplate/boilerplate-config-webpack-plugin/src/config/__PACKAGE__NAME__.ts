import { Compiler, Plugin } from "webpack";

interface __PACKAGE__NAME__OPTIONS__ {
    mode: "production" | "development" | "none";
}

const defualtOptions: Partial<__PACKAGE__NAME__OPTIONS__> = {};

export class __PACKAGE__NAME__ implements Plugin {
    options: Partial<__PACKAGE__NAME__OPTIONS__>;

    constructor(options?: Partial<__PACKAGE__NAME__OPTIONS__>) {
        this.options = Object.assign({}, options);
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
        compiler.hooks.afterEnvironment.tap("__PACKAGE__NAME__", () => {
            compiler.options.module!.rules.push(...config.module.rules);
        });
    }
}
