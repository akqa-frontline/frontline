# @akqa-frontline/js-config-webpack-plugin

![GitHub](https://img.shields.io/github/license/akqa-frontline/frontline)
![npm (scoped)](https://img.shields.io/npm/v/@akqa-frontline/js-config-webpack-plugin)

_this package is not yet fully documented_

JavaScript configuration for webpack.

## What does it do

This package configures loaders for Webpack, optimization/minification, provides a Babel configuration with all the language features we support, and adds tools and utils to assist developing React applications.

#### Notable features

- Works with a Module / No Module setup out of the box
- Babel
    - Class Properties
    - Nullish Coalescing Operator
    - Optional Chaining
    - Dynamic Imports
- SVG as React Components

## Install
Install this package and its peer dependencies:

```
npm install --save-dev --save-exact @akqa-frontline/js-config-webpack-plugin
npm install --save-dev --save-exact webpack
```

## Usage

Add the plugin to your webpack configuration

```
// webpack.config.js

const {FrontlineJsConfigWebpackPlugin} = require("@akqa-frontline/js-config-webpack-plugin");

const moduleWebpackConfiguration = {
    plugins: [
        new FrontlineJsConfigWebpackPlugin({browserslistEnv: "modern"})
    ]
}

const noModuleWebpackConfiguration = {
    plugins: [
        new FrontlineJsConfigWebpackPlugin({browserslistEnv: "legacy"})
    ]
}

module.exports = [moduleWebpackConfiguration, noModuleWebpackConfiguration]
```

Take a look at [webpack-config](https://github.com/akqa-frontline/frontline/tree/master/packages/webpack-config) for instructions on a more complete Frontline webpack configuration.

## Contributing

Please refer to the [contributing](https://github.com/akqa-frontline/frontline/blob/master/CONTRIBUTING.md) document.

## License

ISC © AKQA
