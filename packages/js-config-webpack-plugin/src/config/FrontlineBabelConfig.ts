const browserslist = require("browserslist");
const fs = require("fs");

export function FrontlineBabelConfig() {
    const isEnvDevelopment = process.env.NODE_ENV === "development";
    const isEnvProduction = process.env.NODE_ENV === "production";

    if (!isEnvDevelopment && !isEnvProduction) {
        throw new Error(
            'NODE_ENV environment variable is required. Valid values are "development" and "production".' +
                "Instead, recieved: " +
                JSON.stringify(process.env.NODE_ENV) +
                "."
        );
    }

    const projectDirectory = fs.realpathSync(process.cwd());
    const browserslistConfig = browserslist.findConfig(projectDirectory);

    return {
        env: {
            legacy: {
                presets: [
                    [
                        require("@babel/preset-env").default,
                        {
                            // Do not transform modules to CJS
                            modules: false,
                            // Set the corejs version we are using to avoid warnings in console
                            corejs: 3,
                            useBuiltIns: "usage",

                            targets: {
                                esmodules: false,
                                ...(browserslistConfig
                                    ? Object.keys(browserslistConfig).indexOf(
                                          "legacy"
                                      ) > -1
                                        ? {
                                              browsers:
                                                  browserslistConfig["legacy"]
                                          }
                                        : { browsers: browserslistConfig }
                                    : { browsers: "defaults" })
                            }
                        }
                    ],
                    [
                        require("@babel/preset-react").default,
                        {
                            development: isEnvDevelopment,
                            useBuiltIns: true
                        }
                    ]
                ],
                plugins: [
                    "react-hot-loader/babel",
                    require("@babel/plugin-syntax-dynamic-import").default,
                    require("@babel/plugin-proposal-nullish-coalescing-operator")
                        .default,
                    require("@babel/plugin-proposal-optional-chaining").default,
                    [
                        require("@babel/plugin-proposal-class-properties")
                            .default,
                        { loose: true }
                    ],
                    isEnvProduction && [
                        require("babel-plugin-transform-react-remove-prop-types")
                            .default,
                        { removeImport: true }
                    ],
                    isEnvProduction && [
                        require("@babel/plugin-transform-runtime").default,
                        {
                            corejs: false,
                            helpers: true
                        }
                    ]
                ].filter(Boolean)
            },
            modern: {
                presets: [
                    [
                        require("@babel/preset-env").default,
                        {
                            // Do not transform modules to CJS
                            modules: false,
                            targets: {
                                esmodules: true
                            }
                        }
                    ],
                    [
                        require("@babel/preset-react").default,
                        {
                            development: isEnvDevelopment,
                            useBuiltIns: true
                        }
                    ]
                ],
                plugins: [
                    "react-hot-loader/babel",
                    require("@babel/plugin-syntax-dynamic-import").default,
                    require("@babel/plugin-proposal-nullish-coalescing-operator")
                        .default,
                    require("@babel/plugin-proposal-optional-chaining").default,
                    [
                        require("@babel/plugin-proposal-class-properties")
                            .default,
                        { loose: true }
                    ],
                    isEnvProduction && [
                        require("babel-plugin-transform-react-remove-prop-types")
                            .default,
                        { removeImport: true }
                    ]
                ].filter(Boolean)
            }
        }
    };
}
