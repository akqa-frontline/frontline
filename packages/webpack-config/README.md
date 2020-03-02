# @akqa-frontline/webpack-config

![GitHub](https://img.shields.io/github/license/akqa-frontline/frontline)
![npm (scoped)](https://img.shields.io/npm/v/@akqa-frontline/webpack-config)

_this package is not yet fully documented_

Baseline Configuration for Webpack.

## What does it do

This package can be used to generate a best-practice Webpack configuration.
It is based on [create-react-app](https://github.com/facebook/create-react-app).

#### Notable features

- Vendor and Runtime chunk generation for long-time caching
- HTML generation
- .env variables support in JS and HTML
- Works with a Module / No Module setup out of the box
- Bundle Analyzing
- Asset Manifest generation - optimized for module / no module setup
- Hot Module Reloading

## Install
Install this package and its peer dependencies:

```
npm install --save-dev --save-exact @akqa-frontline/scss-config-webpack-plugin
npm install --save-dev --save-exact webpack @hot-loader/react-dom react react-dom react-hot-loader webpack-dev-server
```

## Usage

Create a Webpack configuration

```
// webpack.config.js

const { FrontlineWebpackConfig } = require("@akqa-frontline/webpack-config")

const moduleWebpackConfig = FrontlineWebpackConfig(
    "modern",
    { ... any webpack configuration you want merged }
)

const noModuleWebpackConfig = FrontlineWebpackConfig(
    "legacy",
    { ... any webpack configuration you want merged }
)

module.exports = [moduleWebpackConfiguration, noModuleWebpackConfiguration]
```

## Contributing

Please refer to the [contributing](https://github.com/akqa-frontline/frontline/blob/master/CONTRIBUTING.md) document.

## License

ISC © AKQA
