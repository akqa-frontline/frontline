# @akqa-frontline/generate-injection-html-webpack-plugin

![GitHub](https://img.shields.io/github/license/akqa-frontline/frontline)
![npm (scoped)](https://img.shields.io/npm/v/@akqa-frontline/generate-injection-html-webpack-plugin)

_this package is not yet fully documented_

Generate html files with entry point assets

## What does it do

This package generates HTML with marktup to load script and styles, for both modern and legacy builds 

## Install
Install this package and its peer dependencies:

```
npm install --save-dev --save-exact @akqa-frontline/generate-injection-html-webpack-plugin
npm install --save-dev --save-exact webpack
```

## Usage

Add the plugin to your webpack configuration

```
// webpack.config.js

const {FrontlineGenerateInjectionHtmlWebpackPlugin} = require("@akqa-frontline/generate-injection-html-webpack-plugin")

const moduleWebpackConfiguration = {
    plugins: [
        new FrontlineGenerateInjectionHtmlWebpackPlugin({browserslistEnv: "modern"})
    ]
}

const noModuleWebpackConfiguration = {
    plugins: [
        new FrontlineGenerateInjectionHtmlWebpackPlugin({browserslistEnv: "legacy"})
    ]
}

module.exports = [moduleWebpackConfiguration, noModuleWebpackConfiguration]
```

Take a look at [webpack-config](https://github.com/akqa-frontline/frontline/tree/master/packages/webpack-config) for instructions on a more complete Frontline webpack configuration.

## Contributing

Please refer to the [contributing](https://github.com/akqa-frontline/frontline/blob/master/CONTRIBUTING.md) document.

## License

ISC © AKQA
