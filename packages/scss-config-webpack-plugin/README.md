# @akqa-frontline/scss-config-webpack-plugin

![GitHub](https://img.shields.io/github/license/akqa-frontline/frontline)
![npm (scoped)](https://img.shields.io/npm/v/@akqa-frontline/scss-config-webpack-plugin)

_this package is not yet fully documented_

(S)CSS configuration for webpack.

## What does it do

This package configures loaders for Sass and CSS, optimization/minification, adds PostCSS, and adds tools and utils to assist styling.

#### Notable features

- CSS Modules
- PostCSS Autoprefixer
- Icon Font generation
- JSON import in SCSS files

## Install
Install this package and its peer dependencies:

```
npm install --save-dev --save-exact @akqa-frontline/scss-config-webpack-plugin
npm install --save-dev --save-exact webpack node-sass
```

## Usage

Add the plugin to your webpack configuration

```
// webpack.config.js

const {FrontlineScssConfigWebpackPlugin} = require("@akqa-frontline/scss-config-webpack-plugin");

const moduleWebpackConfiguration = {
    plugins: [
        new FrontlineScssConfigWebpackPlugin({browserslistEnv: "modern"})
    ]
}

const noModuleWebpackConfiguration = {
    plugins: [
        new FrontlineScssConfigWebpackPlugin({browserslistEnv: "legacy"})
    ]
}

module.exports = [moduleWebpackConfiguration, noModuleWebpackConfiguration]
```

Take a look at [webpack-config](https://github.com/akqa-frontline/frontline/tree/master/packages/webpack-config) for instructions on a more complete Frontline webpack configuration.

## Contributing

Please refer to the [contributing](https://github.com/akqa-frontline/frontline/blob/master/CONTRIBUTING.md) document.

## License

ISC © AKQA
