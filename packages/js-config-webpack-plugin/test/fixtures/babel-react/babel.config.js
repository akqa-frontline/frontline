module.exports = {
    presets: ["@babel/env", "@babel/preset-react", "@babel/preset-typescript"],
    plugins: ["@babel/plugin-proposal-class-properties"],
    env: {
        testDevelopment: {
            plugins: []
        },
        testProduction: {
            plugins: ["babel-plugin-transform-react-remove-prop-types"]
        }
    }
};
