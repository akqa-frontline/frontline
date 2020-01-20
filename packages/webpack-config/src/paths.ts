import path from "path";
import fs from "fs";
import url from "url";

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath: string): string =>
    path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(inputPath: string, needsSlash: boolean): string {
    const hasSlash = inputPath.endsWith("/");
    if (hasSlash && !needsSlash) {
        return inputPath.substr(0, inputPath.length - 1);
    } else if (!hasSlash && needsSlash) {
        return `${inputPath}/`;
    } else {
        return inputPath;
    }
}

// const getPublicUrl = appPackageJson =>
//     envPublicUrl || require(appPackageJson).homepage;

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath() {
    return ensureSlash("/", true);
}

const moduleFileExtensions = [
    "web.mjs",
    "mjs",
    "web.js",
    "js",
    "web.ts",
    "ts",
    "web.tsx",
    "tsx",
    "json",
    "web.jsx",
    "jsx"
];

// Resolve file paths in the same order as webpack
const resolveModule = (
    resolveFn: (s: string) => string,
    filePath: string
): string => {
    const extension = moduleFileExtensions.find(extension =>
        fs.existsSync(resolveFn(`${filePath}.${extension}`))
    );

    if (extension) {
        return resolveFn(`${filePath}.${extension}`);
    }

    return resolveFn(`${filePath}.js`);
};

export default {
    dotenv: resolveApp(".env"),
    appPath: resolveApp("."),
    appBuild: resolveApp("dist"),
    appPublic: resolveApp("public"),
    appHtml: resolveApp("public/index.html"),
    appIndexJs: resolveModule(resolveApp, "src/index"),
    appPackageJson: resolveApp("package.json"),
    appSrc: resolveApp("src"),
    appJsConfig: resolveApp("jsconfig.json"),
    appNodeModules: resolveApp("node_modules"),
    // publicUrl: getPublicUrl(resolveApp("package.json")),
    servedPath: getServedPath(),
    moduleFileExtensions
};
