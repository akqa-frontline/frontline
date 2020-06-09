import { jsDomWindowContext } from "../../../test-utils/src/jsDomWindowContext";

const path = require("path");
const rimraf = require("rimraf");
const fs = require("fs");
const glob = require("glob");
const webpack = require("webpack");

import { FrontlineScssConfigWebpackPlugin } from "../src";

// Allow tests to run 30s
jest.setTimeout(30000);

// Return the code without source map comments
const removeSourceMapComment = (sourceCode: string) => {
    expect(sourceCode).toMatch(/sourceMap/);
    return sourceCode.split("/*# sourceMap")[0].replace(/\s*$/, "");
};

// If webpack compilation fails (before or after compilation) - we want tests to fail
// We will output the reason for webpack failing as the reason - this will usually give you a stacktrace so you can debug easily
// https://webpack.js.org/api/node/#error-handling
const failTestIfWebpackCompilationFails = (err: any, stats: any, done: any) =>
    err
        ? err.details
            ? done.fail(err.details)
            : done.fail(err)
        : stats.hasErrors()
        ? done.fail(JSON.stringify(stats.toJson().errors))
        : stats.hasWarnings()
        ? done.fail(stats.toJson().warnings)
        : null;

beforeAll(done => {
    rimraf(path.join(__dirname, "fixtures/dist"), done);
});

beforeEach(done => {
    process.chdir(path.join(__dirname, "fixtures"));
    rimraf(path.join(__dirname, "fixtures/dist"), done);
});

describe("FrontlineScssConfigWebpackPlugin standalone", () => {
    it("should be creatable without options", () => {
        // eslint-disable-next-line no-new
        new FrontlineScssConfigWebpackPlugin();
    });

    it("should be creatable with options", () => {
        // eslint-disable-next-line no-new
        new FrontlineScssConfigWebpackPlugin({});
    });

    it("should return an instance with the options assigned to it", () => {
        const options = {};
        const instance = new FrontlineScssConfigWebpackPlugin(options);

        expect(instance.options).toEqual(options);
    });
});

describe("FrontlineScssConfigWebpackPlugin inside webpack context", () => {
    it("should compile without errors", done => {
        const compiler = webpack({
            mode: "none",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineScssConfigWebpackPlugin()]
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
            plugins: [new FrontlineScssConfigWebpackPlugin()]
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
            plugins: [new FrontlineScssConfigWebpackPlugin()]
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
            plugins: [new FrontlineScssConfigWebpackPlugin()]
        });
        const compiler = webpack({
            mode: "development",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [
                new FrontlineScssConfigWebpackPlugin({ mode: "production" })
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
            plugins: [new FrontlineScssConfigWebpackPlugin()]
        });
        const compiler = webpack({
            mode: "production",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [
                new FrontlineScssConfigWebpackPlugin({ mode: "development" })
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

    it("should generate no CSS files in development mode", done => {
        const compiler = webpack({
            mode: "development",
            output: {
                filename: "js/main.min.js"
            },
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineScssConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            const generatedFiles = glob.sync("./fixtures/dist/**/*.css", {
                cwd: __dirname
            });
            expect(generatedFiles).toEqual([]);
            done();
        });
    });

    it("should generate the correct CSS files in production mode", done => {
        const compiler = webpack({
            mode: "production",
            context: path.join(__dirname, "fixtures/simple"),
            output: {
                filename: "js/main.min.js"
            },
            plugins: [new FrontlineScssConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            const generatedFiles = glob.sync("./fixtures/dist/**/*.css", {
                cwd: __dirname
            });
            expect(generatedFiles).toEqual([
                "./fixtures/dist/css/main.min.css"
            ]);
            done();
        });
    });

    it("should generate separate CSS files with the correct contents", done => {
        const compiler = webpack({
            mode: "production",
            devtool: "inline-source-map",
            output: {
                filename: "js/main.min.js"
            },
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineScssConfigWebpackPlugin()]
        });
        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            const cssFilePath = path.resolve(
                __dirname,
                "./fixtures/dist/css/main.min.css"
            );

            const contents = fs.readFileSync(cssFilePath).toString();
            expect(contents).toEqual(".test{height:5px}");

            done();
        });
    });

    it("should generate JS with the CSS class inlined inside eval()", done => {
        const compiler = webpack({
            mode: "development",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineScssConfigWebpackPlugin()]
        });
        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            const jsFilePath = path.resolve(
                __dirname,
                "./fixtures/dist/main.js"
            );
            const contents = fs.readFileSync(jsFilePath).toString();
            const classOccurrenceIndex = contents.search(".test");
            expect(classOccurrenceIndex).not.toBe(-1);
            done();
        });
    });

    it("should set rules correctly", done => {
        const compiler = webpack({
            plugins: [new FrontlineScssConfigWebpackPlugin()]
        });
        expect(compiler.options.module.rules.length).toBe(2);
        done();
    });

    it("should have rules matching scss and css files", done => {
        const compiler = webpack({
            plugins: [new FrontlineScssConfigWebpackPlugin()]
        });
        const ruleToTest = compiler.options.module.rules[0];
        expect(ruleToTest.test.test("test.scss")).toBe(true);
        expect(ruleToTest.test.test("test.css")).toBe(true);
        expect(ruleToTest.test.test("testingscss")).toBe(false);
        done();
    });

    it("should generate css that is minified", done => {
        const compiler = webpack({
            mode: "production",
            entry: path.join(__dirname, "fixtures/simple/src/css.js"),
            output: {
                filename: "js/main.min.js"
            },
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineScssConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            const cssSourceFilePath = path.resolve(
                __dirname,
                "./fixtures/simple/src/regular.css"
            );
            const contentsSource = fs
                .readFileSync(cssSourceFilePath)
                .toString();
            const cssDistFilePath = path.resolve(
                __dirname,
                "./fixtures/dist/css/main.min.css"
            );
            const contentsMinified = fs
                .readFileSync(cssDistFilePath)
                .toString();
            // Original source should include white spaces
            expect(contentsSource).toMatch(/\s+/);
            // Minified source should not include white spaces
            expect(contentsMinified).toMatch(/^\S+$/);
            done();
        });
    });

    it("should generate css that contains the class", done => {
        const compiler = webpack({
            mode: "production",
            entry: path.join(__dirname, "fixtures/simple/src/css.js"),
            output: {
                filename: "js/main.min.js"
            },
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineScssConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            const cssFilePath = path.resolve(
                __dirname,
                "./fixtures/dist/css/main.min.css"
            );
            const contents = fs.readFileSync(cssFilePath).toString();
            const classOccurrenceIndex = contents.search(".test");
            expect(classOccurrenceIndex).not.toBe(-1);
            done();
        });
    });

    it("should generate valid css in development mode", done => {
        const compiler = webpack({
            mode: "development",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineScssConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            jsDomWindowContext({
                html: '<div class="test"></div>',
                js: path.resolve(__dirname, "./fixtures/dist/main.js")
            })
                .then(({ window, document }: any) => {
                    const height = window.getComputedStyle(
                        document.querySelector(".test")
                    ).height;
                    expect(height).toBe("5px");
                })
                .then(done, done);
        });
    });

    it("should generate valid css in production mode", done => {
        const compiler = webpack({
            mode: "production",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineScssConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            jsDomWindowContext({
                html: '<div class="test"></div>',
                js: path.resolve(__dirname, "./fixtures/dist/main.js"),
                css: path.resolve(__dirname, "./fixtures/dist/main.css")
            })
                .then(({ window, document }: any) => {
                    const height = window.getComputedStyle(
                        document.querySelector(".test")
                    ).height;
                    expect(height).toBe("5px");
                })
                .then(done, done);
        });
    });

    it("should avoid common flexbox bugs in older browsers in production mode", done => {
        const compiler = webpack({
            mode: "production",
            context: path.join(__dirname, "fixtures/flexbugs"),
            plugins: [new FrontlineScssConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            const cssFilePath = path.resolve(
                __dirname,
                "./fixtures/dist/main.css"
            );
            const contents = fs.readFileSync(cssFilePath).toString();

            expect(contents).toMatchSnapshot();
            done();
        });
    });

    it("should avoid common flexbox bugs in older browsers in development mode", done => {
        const compiler = webpack({
            mode: "development",
            context: path.join(__dirname, "fixtures/flexbugs"),
            plugins: [new FrontlineScssConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            jsDomWindowContext({
                html: '<div class="test"></div>',
                js: path.resolve(__dirname, "./fixtures/dist/main.js")
            })
                .then(({ document }: any) => {
                    const styleHtml = document.querySelector("style").innerHTML;
                    // Exclude sourcemap from test, as it includes user specific paths.
                    const styleHTMLWithoutSourcemap = removeSourceMapComment(
                        styleHtml
                    );
                    expect(styleHTMLWithoutSourcemap).toMatchSnapshot();
                })
                .then(done, done);
        });
    });

    it("should load and provide CSS modules", done => {
        const compiler = webpack({
            mode: "development",
            entry: path.join(__dirname, "fixtures/modules/src/index.js"),
            context: path.join(__dirname, "fixtures/modules"),
            plugins: [new FrontlineScssConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            jsDomWindowContext({
                js: path.resolve(__dirname, "./fixtures/dist/main.js")
            })
                .then(({ window, document }: any) => {
                    const color = window.getComputedStyle(
                        document.getElementById("css-module")
                    ).color;
                    expect(color).toBe("red");
                })
                .then(done, done);
        });
    });

    it("should load and provide CSS modules in production", done => {
        const compiler = webpack({
            mode: "production",
            entry: path.join(__dirname, "fixtures/modules/src/index.js"),
            context: path.join(__dirname, "fixtures/modules"),
            plugins: [new FrontlineScssConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            jsDomWindowContext({
                js: path.resolve(__dirname, "./fixtures/dist/main.js"),
                css: path.resolve(__dirname, "./fixtures/dist/main.css")
            })
                .then(({ window, document }: any) => {
                    const color = window.getComputedStyle(
                        document.getElementById("css-module")
                    ).color;
                    expect(color).toBe("red");
                })
                .then(done, done);
        });
    });

    it("should generate a valid font path", done => {
        const compiler = webpack({
            mode: "production",
            context: path.join(__dirname, "fixtures/assets"),
            output: {
                filename: "main.js"
            },
            module: {
                rules: [
                    {
                        test: /\.woff$/,
                        use: [
                            {
                                loader: require.resolve("file-loader"),
                                options: {
                                    limit: 1
                                }
                            }
                        ]
                    }
                ]
            },
            plugins: [new FrontlineScssConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            const cssFilePath = path.resolve(
                __dirname,
                "./fixtures/dist/main.css"
            );
            const contents = fs.readFileSync(cssFilePath).toString();

            expect(contents).toMatchSnapshot();

            done();
        });
    });

    it("should generate a valid font path for subfolders", done => {
        const compiler = webpack({
            mode: "production",
            context: path.join(__dirname, "fixtures/assets"),
            output: {
                filename: "font-example/js/main.js"
            },
            module: {
                rules: [
                    {
                        test: /\.woff$/,
                        use: [
                            {
                                loader: require.resolve("url-loader"),
                                options: {
                                    limit: 1
                                }
                            }
                        ]
                    }
                ]
            },
            plugins: [new FrontlineScssConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            const cssFilePath = path.resolve(
                __dirname,
                "./fixtures/dist/font-example/css/main.css"
            );
            const contents = fs.readFileSync(cssFilePath).toString();

            expect(contents).toMatchSnapshot();

            done();
        });
    });

    it("should allow overriding sass compiler options", done => {
        const compiler = webpack({
            mode: "production",
            context: path.join(__dirname, "fixtures/sass-options"),
            plugins: [
                new FrontlineScssConfigWebpackPlugin({
                    sassOptions: {
                        includePaths: [
                            path.join(__dirname, "fixtures/sass-options/src")
                        ]
                    }
                })
            ]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            const cssFilePath = path.resolve(
                __dirname,
                "./fixtures/dist/main.css"
            );
            const contents = fs.readFileSync(cssFilePath).toString();

            expect(contents).toEqual(".foo{color:tomato}");

            done();
        });
    });
});
