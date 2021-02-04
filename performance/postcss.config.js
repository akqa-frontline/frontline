const isDevelopment = process.env.NODE_ENV === "development";

const developmentPostcssConfig = {
    plugins: {
        tailwindcss: {}
    }
};

const productionPostcssConfig = {
    plugins: {
        "postcss-flexbugs-fixes": {},
        tailwindcss: {},
        "postcss-preset-env": {
            autoprefixer: {
                flexbox: "no-2009"
            },
            stage: 3
        }
    }
};

module.exports = isDevelopment
    ? developmentPostcssConfig
    : productionPostcssConfig;
