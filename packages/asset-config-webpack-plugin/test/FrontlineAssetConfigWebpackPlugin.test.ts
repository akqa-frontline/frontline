import { failTestIfWebpackCompilationFails } from "../../../test-utils/src/test-utils";

const path = require("path");
const rimraf = require("rimraf");
const fs = require("fs");
const glob = require("glob");
const webpack = require("webpack");

import { FrontlineAssetConfigWebpackPlugin } from "../src";

// Allow tests to run 30s
jest.setTimeout(30000);

beforeAll(done => {
    rimraf(path.join(__dirname, "fixtures/dist"), done);
});

beforeEach(done => {
    process.chdir(path.join(__dirname, "fixtures"));
    rimraf(path.join(__dirname, "fixtures/dist"), done);
});

describe("FrontlineAssetConfigWebpackPlugin standalone", () => {
    it("should be creatable without options", () => {
        // eslint-disable-next-line no-new
        new FrontlineAssetConfigWebpackPlugin();
    });

    it("should be creatable with options", () => {
        // eslint-disable-next-line no-new
        new FrontlineAssetConfigWebpackPlugin({});
    });

    it("should return an instance with the options assigned to it", () => {
        const options = {};
        const instance = new FrontlineAssetConfigWebpackPlugin(options);

        expect(instance.options).toEqual(options);
    });
});

describe("FrontlineAssetConfigWebpackPlugin inside webpack context", () => {
    it("should compile without errors", done => {
        const compiler = webpack({
            mode: "none",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineAssetConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            expect(err).toEqual(null);
            expect(stats.compilation.errors).toEqual([]);
            done();
        });
    });

    it("should compile without errors in development mode", done => {
        const compiler = webpack({
            mode: "development",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineAssetConfigWebpackPlugin()]
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
            plugins: [new FrontlineAssetConfigWebpackPlugin()]
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
            plugins: [new FrontlineAssetConfigWebpackPlugin()]
        });
        const compiler = webpack({
            mode: "development",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [
                new FrontlineAssetConfigWebpackPlugin({ mode: "production" })
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
            plugins: [new FrontlineAssetConfigWebpackPlugin()]
        });
        const compiler = webpack({
            mode: "production",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [
                new FrontlineAssetConfigWebpackPlugin({ mode: "development" })
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

    it("should not copy any files in development mode", done => {
        const compiler = webpack({
            mode: "development",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineAssetConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            const generatedFiles = glob.sync("./fixtures/dist/**/*.*", {
                cwd: __dirname
            });

            expect(generatedFiles).toEqual(["./fixtures/dist/main.js"]);

            done();
        });
    });

    it("should copy the correct files in production mode", done => {
        const compiler = webpack({
            mode: "production",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineAssetConfigWebpackPlugin()]
        });

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            const rootFiles = glob.sync("./fixtures/dist/*.*", {
                cwd: __dirname
            });

            expect(rootFiles).toEqual([
                "./fixtures/dist/main.js",
                "./fixtures/dist/manifest.json"
            ]);

            expect(rootFiles.indexOf("./fixtures/dist/index.html")).toEqual(-1);
            expect(rootFiles.indexOf("./fixtures/dist/about.html")).toEqual(-1);

            done();
        });
    });
});
