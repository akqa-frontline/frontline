import { Compiler, Plugin } from "webpack";

const path = require("path");
const fs = require("fs");

export interface FrontlineGenerateInjectionHtmlWebpackPluginOptions {
    template: string;
    mode: "production" | "development" | "none";
    outputMode: "efficient" | "minimal";
    browserslistEnv: "legacy" | "modern";
}

export class FrontlineGenerateInjectionHtmlWebpackPlugin implements Plugin {
    options: Partial<FrontlineGenerateInjectionHtmlWebpackPluginOptions>;

    constructor(
        options?: Partial<FrontlineGenerateInjectionHtmlWebpackPluginOptions>
    ) {
        if (
            options?.browserslistEnv !== "legacy" &&
            options?.browserslistEnv !== "modern"
        ) {
            throw new Error(
                'browserslistEnv argument must be "modern" or "legacy" - support for single envs is coming in a later release'
            );
        }

        this.options = Object.assign({}, options);
    }

    getTemplatePath(_path?: string | false) {
        if (!_path) {
            return path.resolve(__dirname, "./default.root.ejs");
        }

        return path.resolve(_path);
    }

    apply(compiler: Compiler): void {
        // From https://github.com/webpack/webpack/blob/3366421f1784c449f415cda5930a8e445086f688/lib/WebpackOptionsDefaulter.js#L12-L14
        const isProductionLikeMode =
            this.options.mode !== undefined
                ? this.options.mode === "production"
                : compiler.options.mode === "production" ||
                  !compiler.options.mode;

        const options = Object.assign(
            {
                template: this.getTemplatePath(this.options.template),
                outputMode: this.options.outputMode ?? "efficient"
            },
            this.options
        );

        const config = isProductionLikeMode
            ? require("./production.config")(
                  Object.assign({ mode: "production" }, options)
              )
            : require("./development.config")(
                  Object.assign({ mode: "development" }, options)
              );

        // Merge config
        compiler.options.plugins!.push(...config.plugins);

        compiler.hooks.afterEnvironment.tap(
            "FrontlineGenerateInjectionHtmlWebpackPlugin",
            () => {
                compiler.options.module!.rules.push(...config.module.rules);
            }
        );

        compiler.hooks.done.tap(
            "FrontlineGenerateInjectionHtmlWebpackPlugin",
            () => {
                const rootTemplateFilePath = path.resolve(
                    compiler.outputPath,
                    "./root.generated.html"
                );

                if (fs.existsSync(rootTemplateFilePath)) {
                    const rootGeneratedContent = fs.readFileSync(
                        rootTemplateFilePath,
                        "utf-8"
                    );

                    const [head, body] = rootGeneratedContent.split(
                        "$$split$$"
                    );

                    fs.writeFileSync(
                        path.resolve(
                            compiler.outputPath,
                            "./head.generated.html"
                        ),
                        head,
                        "utf-8"
                    );

                    fs.writeFileSync(
                        path.resolve(
                            compiler.outputPath,
                            "./body.generated.html"
                        ),
                        body,
                        "utf-8"
                    );

                    fs.unlinkSync(
                        path.resolve(
                            compiler.outputPath,
                            "./root.generated.html"
                        )
                    );
                }
            }
        );
    }
}
