import {
    ENVS,
    failTestIfWebpackCompilationFails,
    setEnv
} from "../../../test-utils/src/test-utils";

const path = require("path");
const rimraf = require("rimraf");
const fs = require("fs");
const glob = require("glob");
const webpack = require("webpack");

import { FrontlineGenerateInjectionHtmlWebpackPlugin } from "../src";

import { FrontlineJsConfigWebpackPlugin } from "@akqa-frontline/js-config-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

// Allow tests to run 30s
jest.setTimeout(30000);

const sharedWebpackConfig = {
    mode: "production" as "production",
    context: path.join(__dirname, "fixtures/module-nomodule"),
    entry: {
        main: "./index.js"
    }
};

beforeAll(done => {
    rimraf(path.join(__dirname, "fixtures/dist"), done);
});

beforeEach(done => {
    process.chdir(path.join(__dirname, "fixtures"));
    rimraf(path.join(__dirname, "fixtures/dist"), done);
});

describe("FrontlineGenerateInjectionHtmlWebpackPlugin standalone", () => {
    it("should be creatable with options", () => {
        // eslint-disable-next-line no-new
        new FrontlineGenerateInjectionHtmlWebpackPlugin({
            browserslistEnv: "modern"
        });
    });

    it("should return an instance with the options assigned to it", () => {
        const options = {
            templateHead: "foo.html",
            browserslistEnv: "modern" as "modern"
        };
        const instance = new FrontlineGenerateInjectionHtmlWebpackPlugin(
            options
        );

        expect(instance.options).toEqual(options);
    });
});

describe("FrontlineGenerateInjectionHtmlWebpackPlugin inside webpack context", () => {
    it("should compile without errors", done => {
        const compiler = webpack({
            mode: "none",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [
                new FrontlineGenerateInjectionHtmlWebpackPlugin({
                    browserslistEnv: "modern"
                })
            ]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            expect(err).toEqual(null);
            expect(stats.compilation.errors).toEqual([]);
            done();
        });
    });

    it("should compile without errors in development mode", done => {
        const compiler = webpack({
            mode: "development",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [
                new FrontlineGenerateInjectionHtmlWebpackPlugin({
                    browserslistEnv: "modern"
                })
            ]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            expect(stats.compilation.errors).toEqual([]);
            done();
        });
    });

    it("should compile without errors in production mode", done => {
        const compiler = webpack({
            mode: "production",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [
                new FrontlineGenerateInjectionHtmlWebpackPlugin({
                    browserslistEnv: "modern"
                })
            ]
        });
        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            expect(stats.compilation.errors).toEqual([]);
            done();
        });
    });

    it("should allow to set the production mode mode", done => {
        const referenceCompiler = webpack({
            mode: "production",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [
                new FrontlineGenerateInjectionHtmlWebpackPlugin({
                    browserslistEnv: "modern"
                })
            ]
        });
        const compiler = webpack({
            mode: "development",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [
                new FrontlineGenerateInjectionHtmlWebpackPlugin({
                    browserslistEnv: "modern",
                    mode: "production"
                })
            ]
        });
        const rule = JSON.stringify(compiler.options.module.rules, null, 2);
        const referenceRule = JSON.stringify(
            referenceCompiler.options.module.rules,
            null,
            2
        );
        expect(rule).toEqual(referenceRule);
        done();
    });

    it("should allow to set the development mode mode", done => {
        const referenceCompiler = webpack({
            mode: "development",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [
                new FrontlineGenerateInjectionHtmlWebpackPlugin({
                    browserslistEnv: "modern"
                })
            ]
        });
        const compiler = webpack({
            mode: "production",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [
                new FrontlineGenerateInjectionHtmlWebpackPlugin({
                    browserslistEnv: "modern",
                    mode: "development"
                })
            ]
        });
        const rule = JSON.stringify(compiler.options.module.rules, null, 2);
        const referenceRule = JSON.stringify(
            referenceCompiler.options.module.rules,
            null,
            2
        );
        expect(rule).toEqual(referenceRule);
        done();
    });

    // it("should generate both template files in development mode", done => {
    //     const sharedWebpackConfig = {
    //         mode: "production" as "production",
    //         context: path.join(__dirname, "fixtures/module-nomodule"),
    //         entry: {
    //             main: "./index.js"
    //         },
    //         plugins: [
    //             // new HtmlWebpackPlugin({template: './public/index.html'})
    //         ]
    //     };
    //
    //     const legacyWebpackConfig = {
    //         ...sharedWebpackConfig,
    //         output: {
    //             filename: `[name].legacy.js`,
    //             chunkFilename: `[name].chunk.legacy.js`
    //         },
    //         plugins: [
    //             ...sharedWebpackConfig.plugins,
    //             new FrontlineGenerateInjectionHtmlWebpackPlugin({
    //                 browserslistEnv: "legacy"
    //             })
    //         ]
    //     };
    //
    //     const modernWebpackConfig = {
    //         ...sharedWebpackConfig,
    //         output: {
    //             filename: `[name].modern.js`,
    //             chunkFilename: `[name].chunk.modern.js`
    //         },
    //         plugins: [
    //             ...sharedWebpackConfig.plugins,
    //             new FrontlineJsConfigWebpackPlugin({
    //                 browserslistEnv: "modern"
    //             }),
    //             new FrontlineGenerateInjectionHtmlWebpackPlugin({
    //                 browserslistEnv: "modern"
    //             })
    //         ]
    //     };
    //
    //     const compiler = webpack([modernWebpackConfig, legacyWebpackConfig]);
    //
    //     compiler.run((err: any, stats: any) => {
    //         failTestIfWebpackCompilationFails(err, stats, done);
    //
    //         const generatedFiles = glob.sync(
    //             "./fixtures/dist/*.generated.html",
    //             {
    //                 cwd: __dirname
    //             }
    //         );
    //         expect(generatedFiles.length).toEqual(2);
    //         done();
    //     });
    // });
    //
    it("should generate both template files in production mode", done => {
        const legacyWebpackConfig = {
            ...sharedWebpackConfig,
            output: {
                filename: `[name].legacy.js`,
                chunkFilename: `[name].chunk.legacy.js`
            },
            plugins: [
                new FrontlineJsConfigWebpackPlugin({
                    browserslistEnv: "legacy"
                }),
                new FrontlineGenerateInjectionHtmlWebpackPlugin({
                    browserslistEnv: "legacy"
                })
            ]
        };

        const modernWebpackConfig = {
            ...sharedWebpackConfig,
            output: {
                filename: `[name].modern.js`,
                chunkFilename: `[name].chunk.modern.js`
            },
            plugins: [
                new FrontlineJsConfigWebpackPlugin({
                    browserslistEnv: "modern"
                }),
                new FrontlineGenerateInjectionHtmlWebpackPlugin({
                    browserslistEnv: "modern"
                })
            ]
        };

        const compiler = webpack([modernWebpackConfig, legacyWebpackConfig]);

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            const generatedFiles = glob.sync(
                "./fixtures/dist/*.generated.html",
                {
                    cwd: __dirname
                }
            );

            expect(generatedFiles.length).toEqual(2);

            done();
        });
    });

    it("should generate module/nomodule markup and code in head and leave body empty in effecient mode", done => {
        const currentEnv = process.env.NODE_ENV as ENVS;
        setEnv(ENVS.production);

        const legacyWebpackConfig = {
            ...sharedWebpackConfig,
            output: {
                filename: `[name].legacy.js`,
                chunkFilename: `[name].chunk.legacy.js`
            },
            plugins: [
                new FrontlineJsConfigWebpackPlugin({
                    browserslistEnv: "legacy"
                }),
                new FrontlineGenerateInjectionHtmlWebpackPlugin({
                    browserslistEnv: "legacy"
                })
            ]
        };

        const modernWebpackConfig = {
            ...sharedWebpackConfig,
            output: {
                filename: `[name].modern.js`,
                chunkFilename: `[name].chunk.modern.js`
            },
            plugins: [
                new FrontlineJsConfigWebpackPlugin({
                    browserslistEnv: "modern"
                }),
                new FrontlineGenerateInjectionHtmlWebpackPlugin({
                    browserslistEnv: "modern"
                })
            ]
        };

        const compiler = webpack([modernWebpackConfig, legacyWebpackConfig]);

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            const expectedHeadContent = `<link rel="modulepreload" href="main.modern.js"><script type="module">self.m=1</script><script>addEventListener('DOMContentLoaded', function() {
  $l("main.modern.js", "main.legacy.js")
})
function $l(e,d,c){c=document.createElement("script"),self.m?(e && (c.src=e,c.type="module")):d && (c.src=d),c.src && document.head.appendChild(c)}</script>`;

            const expectedBodyContent = ``;

            const basePath = path.join(__dirname, "fixtures/dist");

            const generatedHeadContent = fs.readFileSync(
                `${basePath}/head.generated.html`,
                "utf-8"
            );
            const generatedBodyContent = fs.readFileSync(
                `${basePath}/body.generated.html`,
                "utf-8"
            );

            expect(generatedHeadContent).toEqual(expectedHeadContent);
            expect(generatedBodyContent).toEqual(expectedBodyContent);

            setEnv(currentEnv);

            done();
        });
    });

    it("should generate module/nomodule markup and code in body and leave head empty in minimal mode", done => {
        const currentEnv = process.env.NODE_ENV as ENVS;
        setEnv(ENVS.production);

        const legacyWebpackConfig = {
            ...sharedWebpackConfig,
            output: {
                filename: `[name].legacy.js`,
                chunkFilename: `[name].chunk.legacy.js`
            },
            plugins: [
                new FrontlineJsConfigWebpackPlugin({
                    browserslistEnv: "legacy"
                }),
                new FrontlineGenerateInjectionHtmlWebpackPlugin({
                    browserslistEnv: "legacy",
                    outputMode: "minimal"
                })
            ]
        };

        const modernWebpackConfig = {
            ...sharedWebpackConfig,
            output: {
                filename: `[name].modern.js`,
                chunkFilename: `[name].chunk.modern.js`
            },
            plugins: [
                new FrontlineJsConfigWebpackPlugin({
                    browserslistEnv: "modern"
                }),
                new FrontlineGenerateInjectionHtmlWebpackPlugin({
                    browserslistEnv: "modern",
                    outputMode: "minimal"
                })
            ]
        };

        const compiler = webpack([modernWebpackConfig, legacyWebpackConfig]);

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            const expectedHeadContent = ``;

            const expectedBodyContent = `<script src="main.modern.js" type="module"></script><script>(function(){var d=document;var c=d.createElement('script');if(!('noModule' in c)&&'onbeforeload' in c){var s=!1;d.addEventListener('beforeload',function(e){if(e.target===c){s=!0}else if(!e.target.hasAttribute('nomodule')||!s){return}e.preventDefault()},!0);c.type='module';c.src='.';d.head.appendChild(c);c.remove()}}())</script><script src="main.legacy.js" nomodule></script>`;

            const basePath = path.join(__dirname, "fixtures/dist");

            const generatedHeadContent = fs.readFileSync(
                `${basePath}/head.generated.html`,
                "utf-8"
            );
            const generatedBodyContent = fs.readFileSync(
                `${basePath}/body.generated.html`,
                "utf-8"
            );

            expect(generatedHeadContent).toEqual(expectedHeadContent);
            expect(generatedBodyContent).toEqual(expectedBodyContent);

            setEnv(currentEnv);

            done();
        });
    });
});
