import {
    ENVS,
    failTestIfWebpackCompilationFails,
    setEnv
} from "../../../test-utils/src/test-utils";

import { FrontlineWebpackConfig } from "../src";
import paths from "../src/paths";

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

    it("should allow overriding the dev-server config", () => {
        const webpackConfig = FrontlineWebpackConfig("modern", {
            devServer: {
                port: 666,
                host: "foobar",
                publicPath: "barfoo",
                overlay: false,
                proxy: {
                    "**": {
                        target: "http://example.local",
                        changeOrigin: true
                    }
                }
            }
        });

        expect(webpackConfig.devServer).toEqual({
            // original settings
            compress: true,
            contentBase: paths.appPublic,
            watchContentBase: true,
            hot: true,
            historyApiFallback: true,
            open: true,

            // overwritten
            port: 666,
            host: "foobar",
            publicPath: "barfoo",
            overlay: false,
            proxy: {
                "**": {
                    target: "http://example.local",
                    changeOrigin: true
                }
            }
        });
    });

    it("should allow overriding the output config", () => {
        const webpackConfig = FrontlineWebpackConfig("modern", {
            output: {
                publicPath: "../foo/bar"
            }
        });

        // should be changed
        expect(webpackConfig.output?.publicPath).toEqual("../foo/bar");

        // should not be changed
        expect(webpackConfig.output?.filename).toEqual(
            "static/js/[name].modern.js"
        );
    });

    it("should adding resolve aliases", () => {
        const webpackConfig = FrontlineWebpackConfig("modern", {
            resolve: {
                alias: {
                    "~": "./foo/bar"
                }
            }
        });

        expect(webpackConfig.resolve?.alias).toEqual({
            "react-dom": "@hot-loader/react-dom",
            "~": "./foo/bar"
        });
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
                "./fixtures/dist/static/js/main.modern.chunk.js",
                "./fixtures/dist/static/js/runtime-main.modern.js"
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
                "./fixtures/dist/static/js/main.modern.chunk.js",
                "./fixtures/dist/static/js/runtime-main.modern.js"
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
                "./fixtures/dist/static/js/namedIndex.modern.chunk.js",
                "./fixtures/dist/static/js/namedSecond.modern.chunk.js",
                "./fixtures/dist/static/js/runtime-namedIndex.modern.js",
                "./fixtures/dist/static/js/runtime-namedSecond.modern.js"
            ]);

            done();
        });
    });

    it("should support disabling HTML index.html generation", done => {
        setEnv(ENVS.production);

        const frontlineWebpackConfig = FrontlineWebpackConfig(
            "modern",
            {
                mode: "production",
                context: path.join(__dirname, "fixtures/simple"),
                entry: {
                    namedIndex: "./src/index.js",
                    namedSecond: "./src/second.js"
                },
                output: {
                    path: path.join(__dirname, "fixtures/dist")
                }
            },
            { generateHTML: false }
        );

        const compiler = webpack(frontlineWebpackConfig);

        compiler.run((err: any, stats: any) => {
            failTestIfWebpackCompilationFails(err, stats, done);

            expect(stats.compilation.errors).toEqual([]);

            let generatedFile;

            try {
                generatedFile = fs.readFileSync(
                    path.join(__dirname, "fixtures/dist/index.html")
                );
            } catch (e) {}

            expect(generatedFile).toEqual(undefined);

            done();
        });
    });
});
