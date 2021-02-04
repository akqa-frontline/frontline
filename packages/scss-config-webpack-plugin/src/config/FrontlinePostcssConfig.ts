export function FrontlinePostcssConfig(
    browserslistEnv: string,
    loaderContext: any
) {
    return {
        plugins: [
            require("postcss-flexbugs-fixes"),
            require("autoprefixer")({
                // flexbox: "no-2009" will add prefixes only for final and IE versions of specification.
                // @see https://github.com/postcss/autoprefixer#disabling
                flexbox: browserslistEnv === "modern" ? false : "no-2009",
                env: browserslistEnv
            }),
            require("iconfont-webpack-plugin")(loaderContext)
        ],
        sourceMap: false
    };
}
