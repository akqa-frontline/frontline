import { failTestIfWebpackCompilationFails } from "../../../test-utils/src/test-utils";

const path = require("path");
const rimraf = require("rimraf");
const fs = require("fs");
const glob = require("glob");
const webpack = require("webpack");

import { FrontlineFontConfigWebpackPlugin } from "../src";

// Allow tests to run 30s
jest.setTimeout(30000);

beforeAll(done => {
    rimraf(path.join(__dirname, "fixtures/dist"), done);
});

beforeEach(done => {
    process.chdir(path.join(__dirname, "fixtures"));
    rimraf(path.join(__dirname, "fixtures/dist"), done);
});

describe("FrontlineFontConfigWebpackPlugin standalone", () => {
    it("should be creatable without options", () => {
        // eslint-disable-next-line no-new
        new FrontlineFontConfigWebpackPlugin();
    });

    it("should be creatable with options", () => {
        // eslint-disable-next-line no-new
        new FrontlineFontConfigWebpackPlugin({});
    });

    it("should return an instance with the options assigned to it", () => {
        const options = {
            name: "static/media/[name].[hash:8].[ext]"
        };
        const instance = new FrontlineFontConfigWebpackPlugin(options);

        expect(instance.options).toEqual(options);
    });
});

describe("FrontlineFontConfigWebpackPlugin inside webpack context", () => {
    it("should compile without errors", done => {
        const compiler = webpack({
            mode: "none",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineFontConfigWebpackPlugin()]
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
            plugins: [new FrontlineFontConfigWebpackPlugin()]
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
            plugins: [new FrontlineFontConfigWebpackPlugin()]
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
            plugins: [new FrontlineFontConfigWebpackPlugin()]
        });
        const compiler = webpack({
            mode: "development",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [
                new FrontlineFontConfigWebpackPlugin({ mode: "production" })
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
            plugins: [new FrontlineFontConfigWebpackPlugin()]
        });
        const compiler = webpack({
            mode: "production",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [
                new FrontlineFontConfigWebpackPlugin({ mode: "development" })
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

    it("should generate the correct WOFF files in development mode", done => {
        const compiler = webpack({
            mode: "development",
            context: path.join(__dirname, "fixtures/simple"),
            plugins: [new FrontlineFontConfigWebpackPlugin()]
        });
        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            const generatedFiles = glob.sync("./fixtures/dist/**/*.woff", {
                cwd: __dirname
            });
            expect(generatedFiles).toHaveLength(1);

            done();
        });
    });
});
