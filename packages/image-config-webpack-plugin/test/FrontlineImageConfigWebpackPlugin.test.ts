import { failTestIfWebpackCompilationFails } from "../../../test-utils/src/test-utils";

const path = require("path");
const rimraf = require("rimraf");
const fs = require("fs");
const glob = require("glob");
const webpack = require("webpack");

import { FrontlineImageConfigWebpackPlugin } from "../src";

// Allow tests to run 30s
jest.setTimeout(30000);

beforeAll(done => {
    rimraf(path.join(__dirname, "fixtures/dist"), done);
});

beforeEach(done => {
    process.chdir(path.join(__dirname, "fixtures"));
    rimraf(path.join(__dirname, "fixtures/dist"), done);
});

describe("FrontlineImageConfigWebpackPlugin standalone", () => {
    it("should be creatable without options", () => {
        // eslint-disable-next-line no-new
        new FrontlineImageConfigWebpackPlugin();
    });

    it("should be creatable with options", () => {
        // eslint-disable-next-line no-new
        new FrontlineImageConfigWebpackPlugin({});
    });

    it("should return an instance with the options assigned to it", () => {
        const options = { name: "[hash]-[name].[ext]" };
        const instance = new FrontlineImageConfigWebpackPlugin(options);

        expect(instance.options).toEqual(options);
    });
});

describe("FrontlineImageConfigWebpackPlugin inside webpack context", () => {
    it("should compile without errors", done => {
        const compiler = webpack({
            mode: "none",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineImageConfigWebpackPlugin()]
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
            plugins: [new FrontlineImageConfigWebpackPlugin()]
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
            plugins: [new FrontlineImageConfigWebpackPlugin()]
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
            plugins: [new FrontlineImageConfigWebpackPlugin()]
        });
        const compiler = webpack({
            mode: "development",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [
                new FrontlineImageConfigWebpackPlugin({ mode: "production" })
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
            plugins: [new FrontlineImageConfigWebpackPlugin()]
        });
        const compiler = webpack({
            mode: "production",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [
                new FrontlineImageConfigWebpackPlugin({ mode: "development" })
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

    it("should generate the correct SVG files in development mode", done => {
        const compiler = webpack({
            mode: "development",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineImageConfigWebpackPlugin()]
        });
        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            // Two files should be generated
            const generatedFiles = glob.sync("./fixtures/dist/**/*.{png,svg}", {
                cwd: __dirname
            });

            expect(generatedFiles.length).toEqual(2);

            const generatedJsFile = glob.sync("./fixtures/dist/main.js", {
                cwd: __dirname
            })[0];
            const generatedJsFileContents = fs.readFileSync(
                path.resolve(__dirname, generatedJsFile),
                "utf-8"
            );

            // The inlined file should be bundled
            expect(
                generatedJsFileContents.indexOf("arrow.inline.svg")
            ).toBeGreaterThan(-1);
            // The svg contents should be inlined
            expect(
                generatedJsFileContents.indexOf("svgInline")
            ).toBeGreaterThan(-1);
            done();
        });
    });

    it("should generate the correct SVG files in production mode", done => {
        const compiler = webpack({
            mode: "production",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineImageConfigWebpackPlugin()]
        });
        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            const generatedFiles = glob.sync("./fixtures/dist/**/*.{png,svg}", {
                cwd: __dirname
            });
            // There should only be one file, because the .inline.svg file should be
            // inlined - and the other svg should be base64 encoded
            expect(generatedFiles).toEqual([
                "./fixtures/dist/static/media/webpack-logo.81da10d7.png"
            ]);

            const generatedJsFile = glob.sync("./fixtures/dist/main.js", {
                cwd: __dirname
            })[0];
            const generatedJsFileContents = fs.readFileSync(
                path.resolve(__dirname, generatedJsFile),
                "utf-8"
            );

            // The svg contents should be inlined
            expect(
                generatedJsFileContents.indexOf("svgInline")
            ).toBeGreaterThan(-1);

            done();
        });
    });

    it("should set rules correctly", done => {
        const compiler = webpack({
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineImageConfigWebpackPlugin()]
        });
        expect(compiler.options.module.rules.length).toBe(2);
        done();
    });

    it("should have rules matching svg files", done => {
        const compiler = webpack({
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineImageConfigWebpackPlugin()]
        });
        const ruleToTest = compiler.options.module.rules[0];
        expect(ruleToTest.test.test("test.svg")).toBe(true);
        expect(ruleToTest.test.test("testingsvg")).toBe(false);
        done();
    });

    it("should have rules matching png files", done => {
        const compiler = webpack({
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineImageConfigWebpackPlugin()]
        });
        const ruleToTest = compiler.options.module.rules[0];
        expect(ruleToTest.test.test("test.png")).toBe(true);
        expect(ruleToTest.test.test("testingpng")).toBe(false);
        done();
    });

    it("should have rules matching jpg files", done => {
        const compiler = webpack({
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineImageConfigWebpackPlugin()]
        });
        const ruleToTest = compiler.options.module.rules[0];
        expect(ruleToTest.test.test("test.jpg")).toBe(true);
        expect(ruleToTest.test.test("testingjpg")).toBe(false);
        done();
    });

    it("should have rules matching jpeg files", done => {
        const compiler = webpack({
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineImageConfigWebpackPlugin()]
        });
        const ruleToTest = compiler.options.module.rules[0];
        expect(ruleToTest.test.test("test.jpeg")).toBe(true);
        expect(ruleToTest.test.test("testingjpeg")).toBe(false);
        done();
    });

    it("should have rules matching gif files", done => {
        const compiler = webpack({
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineImageConfigWebpackPlugin()]
        });
        const ruleToTest = compiler.options.module.rules[0];
        expect(ruleToTest.test.test("test.gif")).toBe(true);
        expect(ruleToTest.test.test("testinggif")).toBe(false);
        done();
    });
});
