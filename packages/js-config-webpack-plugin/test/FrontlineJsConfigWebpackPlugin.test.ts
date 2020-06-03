import { FrontlineJsConfigWebpackPlugin } from "../src";
import {
    ENVS,
    failTestIfWebpackCompilationFails,
    setEnv
} from "../../../test-utils/src/test-utils";
import { jsDomWindowContext } from "../../../test-utils/src/jsDomWindowContext";
import { FrontlineImageConfigWebpackPlugin } from "../../image-config-webpack-plugin/src";

const path = require("path");
const rimraf = require("rimraf");
const fs = require("fs");
const glob = require("glob");
const webpack = require("webpack");

// Allow tests to run 20s
jest.setTimeout(20000);

// Silence console outputoutput
console.warn = jest.fn();

beforeAll(done => {
    rimraf(path.join(__dirname, "fixtures/dist"), done);
});

beforeEach(done => {
    process.chdir(path.join(__dirname, "fixtures"));
    rimraf(path.join(__dirname, "fixtures/dist"), done);
});

afterEach(done => {
    // Reset Babel, node envs to test
    delete process.env.NODE_ENV;
    setEnv(ENVS.test);
    done();
});

describe("FrontlineJsConfigWebpackPlugin standalone", () => {
    it("should be creatable without options", () => {
        // eslint-disable-next-line no-new
        new FrontlineJsConfigWebpackPlugin();
    });

    it("should be creatable with options", () => {
        // eslint-disable-next-line no-new
        new FrontlineJsConfigWebpackPlugin({});
    });

    it("should return an instance with the options assigned to it - including defaults (here no defaults)", () => {
        const simulatedContext = path.resolve(
            __dirname,
            "../test/fixtures/simple/"
        );

        const options = {
            babelConfigFile: path.resolve(simulatedContext, ".babelrc"),
            mode: "production" as "production",
            browserslistEnv: "legacy"
        };

        const instance = new FrontlineJsConfigWebpackPlugin(options);

        expect(instance.options).toEqual({
            babelConfigFile: path.resolve(simulatedContext, ".babelrc"),
            mode: "production",
            browserslistEnv: "legacy"
        });
    });
});

describe("FrontlineJsConfigWebpackPlugin inside webpack context", () => {
    it("should compile without errors", done => {
        setEnv(ENVS.none);

        const compiler = webpack({
            mode: "none",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineJsConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);
            expect(err).toEqual(null);
            done();
        });
    });

    it("should compile without errors in production mode", done => {
        setEnv(ENVS.production);

        const compiler = webpack({
            mode: "production",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineJsConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);
            done();
        });
    });

    it("should compile without errors in development mode", done => {
        setEnv(ENVS.development);

        const compiler = webpack({
            mode: "development",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineJsConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);
            done();
        });
    });

    it("should compile TS without errors", done => {
        setEnv(ENVS.none);

        const compiler = webpack({
            mode: "none",
            context: path.join(__dirname, "fixtures/simple-ts"),
            plugins: [new FrontlineJsConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);
            expect(err).toEqual(null);
            done();
        });
    });

    it("should compile TS without errors in production mode", done => {
        setEnv(ENVS.production);

        const compiler = webpack({
            mode: "production",
            context: path.join(__dirname, "fixtures/simple-ts"),
            plugins: [
                new FrontlineJsConfigWebpackPlugin({
                    browserslistEnv: "modern"
                })
            ]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);
            done();
        });
    });

    it("should compile TS without errors in development mode", done => {
        setEnv(ENVS.development);

        const compiler = webpack({
            mode: "development",
            context: path.join(__dirname, "fixtures/simple-ts"),
            plugins: [new FrontlineJsConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);
            done();
        });
    });

    it("should allow to add the production mode within the js-config-webpack-plugin", done => {
        const referenceCompiler = webpack({
            mode: "production",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineJsConfigWebpackPlugin()]
        });

        const compiler = webpack({
            mode: "development",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [
                new FrontlineJsConfigWebpackPlugin({ mode: "production" })
            ]
        });

        const rule = JSON.stringify(compiler.options.module.rules, null, 2);

        // compiler instance should have production mode active thus the rules should be the same
        // as in the referenceCompiler instance
        // rules have diffs between prod and dev
        const referenceRule = JSON.stringify(
            referenceCompiler.options.module.rules,
            null,
            2
        );

        expect(rule).toEqual(referenceRule);

        done();
    });

    it("should allow to add the development mode within the js-config-webpack-plugin", done => {
        const referenceCompiler = webpack({
            mode: "development",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [
                new FrontlineJsConfigWebpackPlugin({
                    browserslistEnv: "legacy"
                })
            ]
        });

        const compiler = webpack({
            mode: "production",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [
                new FrontlineJsConfigWebpackPlugin({
                    mode: "development",
                    browserslistEnv: "legacy"
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

    it("should have the correct babelConfigFile option in development mode", done => {
        const webpackContext = path.join(__dirname, "fixtures/babel");
        const babelConfigFileContext = path.join(__dirname, "../config");
        const babelConfigFileName = ".babelrc";

        const instance = webpack({
            mode: "development",
            context: webpackContext,
            plugins: [new FrontlineJsConfigWebpackPlugin()]
        });

        const ruleToTest = instance.options.module.rules[0];
        const ruleOptions = ruleToTest.use[0].options;

        expect(ruleOptions.extends).toEqual(
            path.resolve(webpackContext, babelConfigFileName)
        );
        done();
    });

    it("should have the correct babelConfigFile option in development mode (TS)", done => {
        const webpackContext = path.join(__dirname, "fixtures/babel-ts");
        const babelConfigFileName = ".babelrc";

        const instance = webpack({
            mode: "development",
            context: webpackContext,
            plugins: [new FrontlineJsConfigWebpackPlugin()]
        });

        const ruleToTest = instance.options.module.rules[0];
        const ruleOptions = ruleToTest.use[0].options;

        expect(ruleOptions.extends).toEqual(
            path.resolve(webpackContext, babelConfigFileName)
        );
        done();
    });

    it("should have the correct babelConfigFile option in production mode", done => {
        const webpackContext = path.join(__dirname, "fixtures/babel");
        const babelConfigFileName = ".babelrc";

        const instance = webpack({
            mode: "production",
            context: webpackContext,
            plugins: [new FrontlineJsConfigWebpackPlugin()]
        });

        const ruleToTest = instance.options.module.rules[0];
        const ruleOptions = ruleToTest.use[0].options;

        expect(ruleOptions.extends).toEqual(
            path.resolve(webpackContext, babelConfigFileName)
        );

        done();
    });

    it("should load the default babel config", done => {
        const webpackContext = path.join(__dirname, "fixtures/babel-no-babel");
        const babelConfigFileContext = path.join(__dirname, "../src/config");
        const babelConfigFileName = "babel.config.js";

        setEnv(ENVS.development);

        const instance = webpack({
            mode: "development",
            context: webpackContext,
            plugins: [new FrontlineJsConfigWebpackPlugin()]
        });

        const ruleToTest = instance.options.module.rules[0];
        const ruleOptions = ruleToTest.use[0].options;

        expect(ruleOptions.extends).toEqual(
            path.resolve(babelConfigFileContext, babelConfigFileName)
        );

        done();
    });

    it("should load the root babel config", done => {
        const webpackContext = path.join(
            __dirname,
            "fixtures/babel-root-babel"
        );
        const babelConfigFileName = "babel.config.js";

        const instance = webpack({
            mode: "development",
            context: webpackContext,
            plugins: [new FrontlineJsConfigWebpackPlugin()]
        });

        const ruleToTest = instance.options.module.rules[0];
        const ruleOptions = ruleToTest.use[0].options;

        expect(ruleOptions.extends).toEqual(
            path.resolve(webpackContext, babelConfigFileName)
        );

        done();
    });

    it("should allow to pass the babelConfigFile option in development mode", done => {
        const webpackContext = path.join(__dirname, "fixtures/babel");
        const babelConfigFilePath = path.join(webpackContext, ".babelrc");

        const instance = webpack({
            mode: "development",
            context: webpackContext,
            plugins: [
                new FrontlineJsConfigWebpackPlugin({
                    babelConfigFile: babelConfigFilePath
                })
            ]
        });

        const ruleToTest = instance.options.module.rules[0];
        const ruleOptions = ruleToTest.use[0].options;

        expect(path.resolve(webpackContext, babelConfigFilePath)).toEqual(
            ruleOptions.extends
        );

        done();
    });

    it("should allow to pass the babelConfigFile option in production mode", done => {
        const webpackContext = path.join(__dirname, "fixtures/babel");
        const babelConfigFilePath = path.join(webpackContext, ".babelrc");

        const instance = webpack({
            mode: "production",
            context: webpackContext,
            plugins: [
                new FrontlineJsConfigWebpackPlugin({
                    babelConfigFile: babelConfigFilePath
                })
            ]
        });

        const ruleToTest = instance.options.module.rules[0];
        const ruleOptions = ruleToTest.use[0].options;

        expect(ruleOptions.extends).toEqual(
            path.resolve(webpackContext, babelConfigFilePath)
        );

        done();
    });

    it("the correct .babelrc file should be registered", done => {
        const webpackContext = path.join(__dirname, "fixtures/babel");
        const babelConfigFilePath = path.join(__dirname, ".babelrc");

        const compiler = webpack({
            mode: "development",
            context: webpackContext,
            plugins: [
                new FrontlineJsConfigWebpackPlugin({
                    babelConfigFile: babelConfigFilePath
                })
            ]
        });

        const ruleToTest = compiler.options.module.rules[0].use[0];
        const ruleOptions = ruleToTest.options;

        // should fail because .babelrc file searches a not installed plugin
        // means that babelrc file was found
        compiler.run(() => {
            expect(ruleOptions.extends).toBe(
                path.resolve(webpackContext, babelConfigFilePath)
            );
            done();
        });
    });

    it("the correct base .babelrc file should be registered and invoked", done => {
        const webpackContext = path.join(__dirname, "fixtures/babel");
        const babelConfigFileName = ".babelrc";

        setEnv(ENVS.production);

        const compiler = webpack({
            mode: "production",
            context: webpackContext,
            plugins: [new FrontlineJsConfigWebpackPlugin()]
        });

        const ruleToTest = compiler.options.module.rules[0].use[0];
        const ruleOptions = ruleToTest.options;

        // should not fail because base-file of babelrc has no errors
        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);
            expect(ruleOptions.extends).toBe(
                path.resolve(webpackContext, babelConfigFileName)
            );
            done();
        });
    });

    it("the correct custom babelrc file should be registered and invoked", done => {
        const webpackContext = path.join(__dirname, "fixtures/babel-custom/");
        const babelConfigFilePath = path.resolve(
            webpackContext,
            ".custom.babelrc"
        );

        setEnv(ENVS.production);

        const compiler = webpack({
            mode: "production",
            context: webpackContext,
            plugins: [
                new FrontlineJsConfigWebpackPlugin({
                    babelConfigFile: babelConfigFilePath
                })
            ]
        });

        const ruleToTest = compiler.options.module.rules[0].use[0];
        const ruleOptions = ruleToTest.options;

        compiler.run((err: any, stats: any) => {
            // compilation should fail because of not known plugin within babel configuration file
            expect(stats.compilation.errors).not.toEqual([]);

            // property setting
            expect(ruleOptions.extends).toBe(babelConfigFilePath);
            done();
        });
    });

    it("the correct babelrc file should be found witihin the context, registered and then invoked (production)", done => {
        const webpackContextSrc = path.resolve(__dirname, "fixtures/babel/src");

        // the resolveRelativeConfigFile method searches for following files:
        // .babelrc and package.json
        // https://babeljs.io/docs/en/babelrc.html#lookup-behavior
        const babelConfigFileName = ".babelrc";

        setEnv(ENVS.production);

        // without babelConfigFile paramter the lookup should start
        const compiler = webpack({
            mode: "production",
            context: webpackContextSrc,
            entry: "./index.js",
            plugins: [new FrontlineJsConfigWebpackPlugin()]
        });

        const ruleToTest = compiler.options.module.rules[0].use[0];
        // lookup bubbles up the directory tree
        // means that the .bablerc file should be located one level up the context of webpack
        const webpackContext = path.resolve(__dirname, "fixtures/babel");

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);
            const generatedFiles = glob.sync("./fixtures/dist/**/*.js", {
                cwd: __dirname
            });

            // generation of file
            expect(generatedFiles).toEqual(["./fixtures/dist/main.js"]);

            // path settings
            expect(ruleToTest.options.extends).toBe(
                path.join(webpackContext, babelConfigFileName)
            );

            done();
        });
    });

    it("should generate one file called main.js in development mode", done => {
        const compiler = webpack({
            mode: "development",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineJsConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);
            const generatedFiles = glob.sync("./fixtures/dist/**/*.js", {
                cwd: __dirname
            });
            expect(generatedFiles).toEqual(["./fixtures/dist/main.js"]);
            done();
        });
    });

    it("should generate one file called main.js in production mode", done => {
        const compiler = webpack({
            mode: "production",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineJsConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);
            const generatedFiles = glob.sync("./fixtures/dist/**/*.js", {
                cwd: __dirname
            });
            expect(generatedFiles).toEqual(["./fixtures/dist/main.js"]);
            done();
        });
    });

    it("should have rules matching all extensions", done => {
        const compiler = webpack({
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineJsConfigWebpackPlugin()]
        });
        const ruleToTest = compiler.options.module.rules[0];
        // test the 'test'-regex within the rule
        expect(ruleToTest.test.test("test.js")).toBe(true);
        expect(ruleToTest.test.test("test.jsx")).toBe(true);
        expect(ruleToTest.test.test("test.mjs")).toBe(true);
        expect(ruleToTest.test.test("test.mmjs")).toBe(false);
        done();
    });

    it("file in production mode should have the correct code and should be executed correctly inside window-context", done => {
        const webpackContext = path.join(__dirname, "fixtures/window-context");

        setEnv(ENVS.production);

        const compiler = webpack({
            mode: "production",
            context: webpackContext,
            entry: "./index.js",
            plugins: [new FrontlineJsConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);
            // test inside Window-context
            jsDomWindowContext({
                // include the main.js file within the Window-Context
                js: path.join(__dirname, "fixtures/dist/main.js")
            })
                .then(({ window }: any) => {
                    expect(window.WindowManager).toBeDefined();
                    expect(
                        window.WindowManager.getWindowInnerWidth
                    ).toBeDefined();
                    expect(
                        window.WindowManager.getWindowInnerHeight
                    ).toBeDefined();
                })
                .then(done, done);
        });
    });

    it("file in development mode should have the correct code and should be executed correctly inside window-context", done => {
        const webpackContext = path.join(__dirname, "fixtures/window-context/");

        setEnv(ENVS.development);

        const compiler = webpack({
            mode: "development",
            context: webpackContext,
            entry: "./index.js",
            plugins: [new FrontlineJsConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            jsDomWindowContext({
                js: path.resolve(__dirname, "fixtures/dist/main.js")
            })
                .then(({ window }: any) => {
                    expect(window.WindowManager).toBeDefined();
                    expect(
                        window.WindowManager.getWindowInnerWidth
                    ).toBeDefined();
                    expect(
                        window.WindowManager.getWindowInnerHeight
                    ).toBeDefined();
                })
                .then(done, done);
        });
    });

    it("file in production mode should manipulate the DOM correctly", done => {
        const webpackContext = path.join(
            __dirname,
            "fixtures/dom-manipulation/"
        );

        setEnv(ENVS.production);

        const compiler = webpack({
            mode: "production",
            context: webpackContext,
            entry: "./index.js",
            plugins: [new FrontlineJsConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            jsDomWindowContext({
                html: '<div id="container"></div>',
                js: path.resolve(__dirname, "./fixtures/dist/main.js")
            })
                .then(({ _, document }: any) => {
                    const numberOfChildren = document.querySelector(
                        "#container"
                    ).children.length;
                    expect(numberOfChildren).toBe(2);
                })
                .then(done, done);
        });
    });

    it("file in development mode should manipulate the DOM correctly", done => {
        const webpackContext = path.join(
            __dirname,
            "fixtures/dom-manipulation/"
        );

        setEnv(ENVS.development);

        const compiler = webpack({
            mode: "production",
            context: webpackContext,
            entry: "./index.js",
            plugins: [new FrontlineJsConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            jsDomWindowContext({
                html: '<div id="container"></div>',
                js: path.resolve(__dirname, "./fixtures/dist/main.js")
            })
                .then(({ _, document }: any) => {
                    const numberOfChildren = document.querySelector(
                        "#container"
                    ).children.length;
                    expect(numberOfChildren).toBe(2);
                })
                .then(done, done);
        });
    });

    it("file in production mode should render a React App and Component correctly", done => {
        const webpackContext = path.join(__dirname, "fixtures/babel-react/");

        setEnv(ENVS.production);

        const compiler = webpack({
            mode: "production",
            context: webpackContext,
            entry: "./index.js",
            plugins: [
                new FrontlineJsConfigWebpackPlugin({
                    browserslistEnv: "testProduction"
                })
            ]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            jsDomWindowContext({
                html: '<div id="root"></div>',
                js: path.resolve(__dirname, "./fixtures/dist/main.js")
            })
                .then(({ _, document }: any) => {
                    const headingOneExpectedText = "React App";
                    const headingTwoExpectedText = "Hello World";
                    const reactRoot = document.querySelector("#root");

                    const headingOneText = reactRoot.querySelector("h1")
                        .textContent;
                    const headingTwoText = reactRoot.querySelector("h2")
                        .textContent;

                    expect(headingOneText).toBe(headingOneExpectedText);
                    // It can also render a child component
                    expect(headingTwoText).toBe(headingTwoExpectedText);
                })
                .then(done, done);
        });
    });

    it("file in development mode should render a React App and Component correctly", done => {
        const webpackContext = path.join(__dirname, "fixtures/babel-react/");

        setEnv(ENVS.development);

        const compiler = webpack({
            mode: "development",
            context: webpackContext,
            entry: "./index.js",
            plugins: [
                new FrontlineJsConfigWebpackPlugin({
                    browserslistEnv: "testDevelopment"
                })
            ]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            jsDomWindowContext({
                html: '<div id="root"></div>',
                js: path.resolve(__dirname, "./fixtures/dist/main.js")
            })
                .then(({ _, document }: any) => {
                    const headingOneExpectedText = "React App";
                    const headingTwoExpectedText = "Hello World";
                    const reactRoot = document.querySelector("#root");

                    const headingOneText = reactRoot.querySelector("h1")
                        .textContent;
                    const headingTwoText = reactRoot.querySelector("h2")
                        .textContent;

                    expect(headingOneText).toBe(headingOneExpectedText);
                    // It can also render a child component
                    expect(headingTwoText).toBe(headingTwoExpectedText);
                })
                .then(done, done);
        });
    });

    it("propTypes is removed from React Components in production mode", done => {
        const webpackContext = path.join(__dirname, "fixtures/babel-react/");

        setEnv(ENVS.production);

        const compiler = webpack({
            mode: "production",
            context: webpackContext,
            entry: "./index.js",
            plugins: [
                new FrontlineJsConfigWebpackPlugin({
                    browserslistEnv: "testProduction"
                })
            ]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            jsDomWindowContext({
                html: '<div id="root"></div>',
                js: path.resolve(__dirname, "./fixtures/dist/main.js")
            })
                .then(({ window }: any) => {
                    const ReactComponent = window.MyComponentInstanceWithProps;

                    expect(ReactComponent).toBeDefined();

                    expect(ReactComponent.type.propTypes).toBeUndefined();
                })
                .then(done, done);
        });
    });

    it("propTypes exists on React Components in development mode", done => {
        const webpackContext = path.join(__dirname, "fixtures/babel-react/");

        setEnv(ENVS.development);

        const compiler = webpack({
            mode: "development",
            context: webpackContext,
            entry: "./index.js",
            plugins: [
                new FrontlineJsConfigWebpackPlugin({
                    browserslistEnv: "testDevelopment"
                })
            ]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            jsDomWindowContext({
                html: '<div id="root"></div>',
                js: path.resolve(__dirname, "./fixtures/dist/main.js")
            })
                .then(({ window }: any) => {
                    const ReactComponent = window.MyComponentInstanceWithProps;

                    expect(ReactComponent).toBeDefined();

                    expect(ReactComponent.type.propTypes).toBeDefined();
                })
                .then(done, done);
        });
    });

    it("supports class properties", done => {
        const webpackContext = path.join(
            __dirname,
            "fixtures/language-features/class-properties/"
        );

        setEnv(ENVS.production);

        const compiler = webpack({
            mode: "production",
            context: webpackContext,
            plugins: [new FrontlineJsConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);
            const generatedFiles = glob.sync("./fixtures/dist/**/*.js", {
                cwd: __dirname
            });
            expect(generatedFiles).toEqual(["./fixtures/dist/main.js"]);
            done();
        });
    });

    it("supports object rest and spread", done => {
        const webpackContext = path.join(
            __dirname,
            "fixtures/language-features/object-rest-spread/"
        );

        setEnv(ENVS.production);

        const compiler = webpack({
            mode: "production",
            context: webpackContext,
            plugins: [new FrontlineJsConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);
            const generatedFiles = glob.sync("./fixtures/dist/**/*.js", {
                cwd: __dirname
            });
            expect(generatedFiles).toEqual(["./fixtures/dist/main.js"]);
            done();
        });
    });

    it("supports dynamic imports", done => {
        const webpackContext = path.join(
            __dirname,
            "fixtures/language-features/syntax-dynamic-import/"
        );

        setEnv(ENVS.production);

        const compiler = webpack({
            mode: "production",
            context: webpackContext,
            plugins: [new FrontlineJsConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);
            const generatedFiles = glob.sync("./fixtures/dist/**/*.js", {
                cwd: __dirname
            });
            expect(generatedFiles.length).toEqual(2);
            done();
        });
    });

    it("supports destructuring", done => {
        const webpackContext = path.join(
            __dirname,
            "fixtures/language-features/transform-destructuring/"
        );

        setEnv(ENVS.production);

        const compiler = webpack({
            mode: "production",
            context: webpackContext,
            plugins: [new FrontlineJsConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);
            const generatedFiles = glob.sync("./fixtures/dist/**/*.js", {
                cwd: __dirname
            });
            expect(generatedFiles).toEqual(["./fixtures/dist/main.js"]);
            done();
        });
    });

    it("supports optional chaining", done => {
        const webpackContext = path.join(
            __dirname,
            "fixtures/language-features/optional-chaining/"
        );

        setEnv(ENVS.production);

        const compiler = webpack({
            mode: "production",
            context: webpackContext,
            plugins: [new FrontlineJsConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);
            const generatedFiles = glob.sync("./fixtures/dist/**/*.js", {
                cwd: __dirname
            });
            expect(generatedFiles).toEqual(["./fixtures/dist/main.js"]);
            done();
        });
    });

    it("supports nullish coalescing operator", done => {
        const webpackContext = path.join(
            __dirname,
            "fixtures/language-features/nullish-coalescing-operator/"
        );

        setEnv(ENVS.production);

        const compiler = webpack({
            mode: "production",
            context: webpackContext,
            plugins: [new FrontlineJsConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);
            const generatedFiles = glob.sync("./fixtures/dist/**/*.js", {
                cwd: __dirname
            });
            expect(generatedFiles).toEqual(["./fixtures/dist/main.js"]);
            done();
        });
    });

    it("uses @babel/plugin-transform-runtime", done => {
        const webpackContext = path.join(
            __dirname,
            "fixtures/babel-environments/"
        );

        setEnv(ENVS.production);

        const compiler = webpack({
            mode: "production",
            context: webpackContext,
            plugins: [
                new FrontlineJsConfigWebpackPlugin({
                    browserslistEnv: "legacy"
                })
            ]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);
            const generatedFiles = glob.sync("./fixtures/dist/**/*.js", {
                cwd: __dirname
            });
            expect(generatedFiles).toEqual(["./fixtures/dist/main.js"]);
            done();
        });
    });

    it("SVGR - should create React Components from .component.svg files", done => {
        const compiler = webpack({
            mode: "development",
            context: path.join(__dirname, "fixtures/babel-react"),
            entry: "./index.js",
            plugins: [
                new FrontlineJsConfigWebpackPlugin({
                    browserslistEnv: "testDevelopment"
                })
            ]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            jsDomWindowContext({
                html: '<div id="root"></div>',
                js: path.resolve(__dirname, "./fixtures/dist/main.js")
            })
                .then(({ _, document }: any) => {
                    const svgElement = document.querySelector("svg");

                    expect(svgElement).toBeDefined();
                })
                .then(done, done);
        });
    });
});
