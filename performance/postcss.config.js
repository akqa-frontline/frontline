const isDevelopment = process.env.NODE_ENV === "development";

const developmentPostcssConfig = {
    plugins: [
        // require("tailwindcss")
    ]
    // plugins: {
    //     tailwindcss: {}
    // }
};

const productionPostcssConfig = {
    plugins: [
        require("postcss-flexbugs-fixes"),
        // require("tailwindcss"),
        require("postcss-preset-env")({
            autoprefixer: {
                flexbox: "no-2009"
            },
            stage: 3
        })
    ]
    // plugins: {
    //     "postcss-flexbugs-fixes": {},
    //     tailwindcss: {},
    //     "postcss-preset-env": {
    //         autoprefixer: {
    //             flexbox: "no-2009"
    //         },
    //         stage: 3
    //     }
    // }
};

module.exports = isDevelopment
    ? developmentPostcssConfig
    : productionPostcssConfig;
