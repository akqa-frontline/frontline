# @akqa-frontline/asset-config-webpack-plugin

![GitHub](https://img.shields.io/github/license/akqa-frontline/frontline)
![npm (scoped)](https://img.shields.io/npm/v/@akqa-frontline/asset-config-webpack-plugin)

_this package is not yet fully documented_

Static assets configuration for webpack.

## What does it do

This package does not do much currently.

When creating a production build, it will copy all files _except html files_ from the `public` folder to the build output folder.

## Install
Install this package and its peer dependencies:

```
npm install --save-dev --save-exact @akqa-frontline/asset-config-webpack-plugin
npm install --save-dev --save-exact webpack
```

## Usage

Add the plugin to your webpack configuration

```
// webpack.config.js

const {FrontlineAssetConfigWebpackPlugin} = require("@akqa-frontline/asset-config-webpack-plugin")

module.exports = {
    plugins: [
        new FrontlineAssetConfigWebpackPlugin()
    ]
}
```

Take a look at [webpack-config](https://github.com/akqa-frontline/frontline/tree/master/packages/webpack-config) for instructions on a more complete Frontline webpack configuration.

## Contributing

Please refer to the [contributing](https://github.com/akqa-frontline/frontline/blob/master/CONTRIBUTING.md) document.

## License

ISC © AKQA
