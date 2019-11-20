const { FrontlineBabelConfig } = require("@akqa-frontline/webpack-config");

const config = FrontlineBabelConfig();

module.exports = config;

// const browserslists = require("browserslist");
// const browserslistConfig = browserslists.findConfig(__dirname);
//
// const isEnvDevelopment = process.env.NODE_ENV === "development";
// const isEnvProduction = process.env.NODE_ENV === "production";
//
// if (!isEnvDevelopment && !isEnvProduction) {
//     throw new Error(
//         'NODE_ENV environment variable is required. Valid values are "development" and "production".' +
//             "Instead, recieved: " +
//             JSON.stringify(process.env.NODE_ENV) +
//             "."
//     );
// }
//
// module.exports = {
//     env: {
//         legacy: {
//             presets: [
//                 [
//                     "@babel/preset-env",
//                     {
//                         // Do not transform modules to CJS
//                         modules: false,
//                         // Set the corejs version we are using to avoid warnings in console
//                         corejs: 3,
//                         useBuiltIns: "usage",
//                         targets: {
//                             ...(Object.keys(browserslistConfig).length > 0
//                                 ? { browsers: browserslistConfig["legacy"] }
//                                 : { browsers: browserslistConfig }),
//                             esmodules: false
//                         }
//                     }
//                 ],
//                 [
//                     "@babel/preset-react",
//                     {
//                         development: isEnvDevelopment,
//                         useBuiltIns: true
//                     }
//                 ]
//             ],
//             plugins: [
//                 "react-hot-loader/babel",
//                 "@babel/plugin-syntax-dynamic-import",
//                 ["@babel/plugin-proposal-class-properties", { loose: true }],
//                 isEnvProduction && [
//                     "babel-plugin-transform-react-remove-prop-types",
//                     { removeImport: true }
//                 ],
//                 isEnvProduction && [
//                     "@babel/plugin-transform-runtime",
//                     { corejs: 3 }
//                 ]
//             ].filter(Boolean)
//         },
//         modern: {
//             presets: [
//                 [
//                     "@babel/preset-env",
//                     {
//                         // Do not transform modules to CJS
//                         modules: false,
//                         targets: {
//                             esmodules: true
//                         }
//                     }
//                 ],
//                 [
//                     "@babel/preset-react",
//                     {
//                         development: isEnvDevelopment,
//                         useBuiltIns: true
//                     }
//                 ]
//             ],
//             plugins: [
//                 "react-hot-loader/babel",
//                 "@babel/plugin-syntax-dynamic-import",
//                 ["@babel/plugin-proposal-class-properties", { loose: true }],
//                 isEnvProduction && [
//                     "babel-plugin-transform-react-remove-prop-types",
//                     { removeImport: true }
//                 ],
//                 isEnvProduction && [
//                     "@babel/plugin-transform-runtime",
//                     { corejs: false }
//                 ]
//             ].filter(Boolean)
//         }
//     }
// };
