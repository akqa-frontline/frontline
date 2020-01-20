import {
    ENVS,
    failTestIfWebpackCompilationFails,
    setEnv
} from "../../../test-utils/src/test-utils";
import { FrontlineWebpackConfig, FrontlineBabelConfig } from "../src";

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

describe("FrontlineBabelConfig", () => {
    it("should be creatable with options", () => {
        setEnv(ENVS.development);

        const babelConfig = FrontlineBabelConfig(
            path.join(__dirname, "fixtures/babel")
        );

        expect(babelConfig).toBeDefined();
    });
});
