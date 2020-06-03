const craEslintConfig = require("eslint-config-react-app");

module.exports = {
    ...craEslintConfig,
    // any plugins are okay, except things relating to flow which we dont use
    plugins: [...craEslintConfig.plugins.filter(p => !p.match("flowtype"))],
    overrides: [
        {
            ...craEslintConfig.overrides[0],
            parserOptions: {
                ...craEslintConfig.overrides[0].parserOptions,
                project: "./tsconfig.json"
            }
        }
    ],
    // any rules are okay, except things relating to flow which we dont use
    rules: Object.keys(craEslintConfig.rules)
        .filter(key => !key.match("flowtype"))
        .reduce((obj, key) => {
            obj[key] = craEslintConfig.rules[key];
            return obj;
        }, {}),
    extends: ["plugin:prettier/recommended"],
    settings: {
        ...craEslintConfig.settings,
        "import/resolver": {
            typescript: {}
        }
    }
};
