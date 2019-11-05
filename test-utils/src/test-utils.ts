// If webpack compilation fails (before or after compilation) - we want tests to fail
// We will output the reason for webpack failing as the reason - this will usually give you a stacktrace so you can debug easily
// https://webpack.js.org/api/node/#error-handling
export const failTestIfWebpackCompilationFails = (
    err: any,
    stats: any,
    done: any
) =>
    err
        ? err.details
            ? done.fail(err.details)
            : done.fail(err)
        : stats.hasErrors()
        ? done.fail(JSON.stringify(stats.toJson().errors, null, 2))
        : stats.hasWarnings()
        ? done.fail(JSON.stringify(stats.toJson().warnings, null, 2))
        : null;

export enum ENVS {
    none = "none",
    development = "development",
    production = "production",
    test = "test"
}

export const setEnv = (env: ENVS) => {
    process.env.NODE_ENV = env;
    process.env.BABEL_ENV = env;
};

// Return the code without source map comments
export const removeSourceMapComment = (sourceCode: string) => {
    expect(sourceCode).toMatch(/sourceMap/);
    return sourceCode.split("/*# sourceMap")[0].replace(/\s*$/, "");
};
