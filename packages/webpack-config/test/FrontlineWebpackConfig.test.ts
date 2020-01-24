import {
    ENVS,
    failTestIfWebpackCompilationFails,
    setEnv
} from "../../../test-utils/src/test-utils";
import { FrontlineWebpackConfig } from "../src";

const path = require("path");
const rimraf = require("rimraf");
const fs = require("fs");
const glob = require("glob");
const webpack = require("webpack");

// Allow tests to run 30s
jest.setTimeout(30000);

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

describe("FrontlineWebpackConfig", () => {
    it("should be creatable with options", () => {
        setEnv(ENVS.development);

        const webpackConfig = FrontlineWebpackConfig("modern", {});

        expect(webpackConfig).toBeDefined();
    });
});

describe("FrontlineWebpackConfig inside webpack context", () => {
    it("should compile without errors", done => {
        const frontlineWebpackConfig = FrontlineWebpackConfig("modern", {
            mode: "none",
            context: path.join(__dirname, "fixtures/simple")
        });

        const compiler = webpack(frontlineWebpackConfig);

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            expect(stats.compilation.errors).toEqual([]);
            done();
        });
    });

    it("should compile without errors in development mode", done => {
        const frontlineWebpackConfig = FrontlineWebpackConfig("modern", {
            mode: "development",
            context: path.join(__dirname, "fixtures/simple")
        });

        const compiler = webpack(frontlineWebpackConfig);

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            expect(stats.compilation.errors).toEqual([]);
            done();
        });
    });

    it("should compile without errors in production mode", done => {
        const frontlineWebpackConfig = FrontlineWebpackConfig("modern", {
            mode: "production",
            context: path.join(__dirname, "fixtures/simple")
        });

        const compiler = webpack(frontlineWebpackConfig);

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            expect(stats.compilation.errors).toEqual([]);
            done();
        });
    });

    it("should support entry as a single string", done => {
        const frontlineWebpackConfig = FrontlineWebpackConfig("modern", {
            mode: "production",
            context: path.join(__dirname, "fixtures/simple"),
            entry: "./src/index.js",
            output: {
                path: path.join(__dirname, "fixtures/dist")
            }
        });

        const compiler = webpack(frontlineWebpackConfig);

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            expect(stats.compilation.errors).toEqual([]);

            const generatedFiles = glob.sync("./fixtures/dist/**/*.js", {
                cwd: __dirname
            });

            expect(generatedFiles).toEqual([
                "./fixtures/dist/static/js/main.chunk.js",
                "./fixtures/dist/static/js/runtime-main.js"
            ]);

            done();
        });
    });

    it("should support entry as an array of strings", done => {
        const frontlineWebpackConfig = FrontlineWebpackConfig("modern", {
            mode: "production",
            context: path.join(__dirname, "fixtures/simple"),
            entry: ["./src/index.js", "./src/second.js"],
            output: {
                path: path.join(__dirname, "fixtures/dist")
            }
        });

        const compiler = webpack(frontlineWebpackConfig);

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            expect(stats.compilation.errors).toEqual([]);

            const generatedFiles = glob.sync("./fixtures/dist/**/*.js", {
                cwd: __dirname
            });

            expect(generatedFiles).toEqual([
                "./fixtures/dist/static/js/main.chunk.js",
                "./fixtures/dist/static/js/runtime-main.js"
            ]);

            done();
        });
    });

    it("should support entry as a map", done => {
        setEnv(ENVS.production);

        const frontlineWebpackConfig = FrontlineWebpackConfig("modern", {
            mode: "production",
            context: path.join(__dirname, "fixtures/simple"),
            entry: {
                namedIndex: "./src/index.js",
                namedSecond: "./src/second.js"
            },
            output: {
                path: path.join(__dirname, "fixtures/dist")
            }
        });

        const compiler = webpack(frontlineWebpackConfig);

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            expect(stats.compilation.errors).toEqual([]);

            const generatedFiles = glob.sync("./fixtures/dist/**/*.js", {
                cwd: __dirname
            });

            expect(generatedFiles).toEqual([
                "./fixtures/dist/static/js/namedIndex.chunk.js",
                "./fixtures/dist/static/js/namedSecond.chunk.js",
                "./fixtures/dist/static/js/runtime-namedIndex.js",
                "./fixtures/dist/static/js/runtime-namedSecond.js"
            ]);

            done();
        });
    });
});
