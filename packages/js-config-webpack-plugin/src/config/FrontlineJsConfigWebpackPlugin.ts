import { Compiler, Plugin } from "webpack";
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const findPackageData = require("@babel/core/lib/config/files/package")
    .findPackageData;
const findRelativeConfig = require("@babel/core/lib/config/files/configuration")
    .findRelativeConfig;
const findRootConfig = require("@babel/core/lib/config/files/configuration")
    .findRootConfig;

export interface FrontlineJsConfigWebpackPluginOptions {
    mode: "production" | "development" | "none";
    browserslistEnv: string;
    babelConfigFile?: string;
    tsConfigFile?: string;
    plugins?: any;
    enableEslint?: boolean;
}

const defaultConfig = {
    browserslistEnv: "legacy"
};

export class FrontlineJsConfigWebpackPlugin implements Plugin {
    options: Partial<FrontlineJsConfigWebpackPluginOptions>;

    constructor(options?: Partial<FrontlineJsConfigWebpackPluginOptions>) {
        this.options = Object.assign({}, defaultConfig, options);
    }

    resolveBabelConfigFilePath(
        contextPath: string,
        environmentName: "production" | "development" | "none" | undefined
    ) {
        // From https://github.com/babel/babel/blob/52a569056c6008c453bf26219461655c7d0322c4/packages/babel-core/src/config/files/package.js#L15
        const packageData = findPackageData(contextPath);
        // needed because babels `findRelativeConfig` search just in parent directories
        packageData.directories.push(packageData.filepath);
        // From https://github.com/babel/babel/blob/52a569056c6008c453bf26219461655c7d0322c4/packages/babel-core/src/config/files/configuration.js#L26
        const resolvedRelativeConfig = findRelativeConfig(
            packageData,
            environmentName
        );
        const resolvedRootConfig = findRootConfig(
            packageData.filepath,
            environmentName
        );

        // babel.config.js
        if (resolvedRootConfig && resolvedRootConfig.filepath) {
            return resolvedRootConfig.filepath;
        }

        // .babelrc.js and .babelrc
        if (resolvedRelativeConfig && resolvedRelativeConfig.config) {
            return resolvedRelativeConfig.config.filepath;
        }

        return path.resolve(__dirname, "./babel.config.js");
    }

    resolveTypeScriptConfigFilePath(
        contextPath: string,
        browserslistEnv = defaultConfig.browserslistEnv
    ) {
        const searchLocations = [
            path.join(contextPath, `tsconfig.${browserslistEnv}.json`),
            path.join(contextPath, "tsconfig.json")
        ];

        for (const filePath of searchLocations) {
            if (fs.existsSync(filePath)) {
                return filePath;
            }
        }

        return path.resolve(__dirname, "./tsconfig.json");
    }

    apply(compiler: Compiler): void {
        const defaultOptions = {
            babelConfigFile:
                this.options.babelConfigFile ||
                this.resolveBabelConfigFilePath(
                    compiler.context,
                    compiler.options.mode || this.options.mode
                ),
            tsConfigFile:
                this.options.tsConfigFile ||
                this.resolveTypeScriptConfigFilePath(
                    compiler.context,
                    this.options.browserslistEnv
                ),
            enableEslint: this.options.enableEslint ?? true,
            plugins: this.options.plugins || []
        };

        if (this.options.browserslistEnv === "modern") {
            defaultOptions.plugins = this.options.plugins || [
                new ForkTsCheckerWebpackPlugin({
                    tsconfig: defaultOptions.tsConfigFile,
                    eslint: defaultOptions.enableEslint
                })
            ];
        }

        const options = Object.assign(this.options, defaultOptions);

        // From https://github.com/webpack/webpack/blob/3366421f1784c449f415cda5930a8e445086f688/lib/WebpackOptionsDefaulter.js#L12-L14
        const isProductionLikeMode =
            this.options.mode !== undefined
                ? this.options.mode === "production"
                : compiler.options.mode === "production" ||
                  !compiler.options.mode;

        const config = isProductionLikeMode
            ? require("./production.config")(
                  Object.assign({ mode: "production" }, options)
              )
            : require("./development.config")(
                  Object.assign({ mode: "development" }, options)
              );

        config.plugins.forEach((plugin: any) => plugin.apply(compiler));

        compiler.hooks.afterEnvironment.tap(
            "FrontlineJsConfigWebpackPlugin",
            () => {
                compiler.options.module!.rules.push(...config.module.rules);

                let tsConfig = require(defaultOptions.tsConfigFile);
                if (tsConfig.extends) {
                    tsConfig = require(path.join(
                        compiler.context,
                        tsConfig.extends
                    ));
                }

                if (
                    tsConfig.compilerOptions &&
                    tsConfig.compilerOptions.paths &&
                    tsConfig.compilerOptions.baseUrl
                ) {
                    Object.keys(tsConfig.compilerOptions.paths).reduce(
                        (aliases = {}, aliasName) => {
                            const baseUrl = tsConfig.compilerOptions.baseUrl.replace(
                                "/*",
                                ""
                            );
                            const aliasPath = tsConfig.compilerOptions.paths[
                                aliasName
                            ][0].replace("/*", "");
                            aliases[aliasName.replace("/*", "")] = path.join(
                                compiler.context,
                                baseUrl,
                                aliasPath
                            );
                            return aliases;
                        },
                        compiler.options.resolve!.alias
                    );
                }
            }
        );

        const javascriptExtensions = [
            ".ts",
            ".tsx",
            ".js",
            ".jsx",
            ".mjs"
        ].filter(ext => !compiler.options.resolve!.extensions!.includes(ext));

        compiler.options.resolve!.extensions!.unshift(...javascriptExtensions);
    }
}
