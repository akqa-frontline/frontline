module.exports = {
    presets: ["@babel/env"],
    plugins: [],
    env: {
        legacy: {
            plugins: [
                [
                    "@babel/plugin-transform-runtime",
                    {
                        corejs: 3
                    }
                ]
            ]
        }
    }
};
