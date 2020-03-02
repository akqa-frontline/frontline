# @akqa-frontline/font-config-webpack-plugin

![GitHub](https://img.shields.io/github/license/akqa-frontline/frontline)
![npm (scoped)](https://img.shields.io/npm/v/@akqa-frontline/font-config-webpack-plugin)

_this package is not yet fully documented_

Font configuration for webpack.

## What does it do

This package lets you use font assets in your JS and (S)CSS files.

## Install
Install this package and its peer dependencies:

```
npm install --save-dev --save-exact @akqa-frontline/font-config-webpack-plugin
npm install --save-dev --save-exact webpack
```

## Usage

Add the plugin to your webpack configuration

```
// webpack.config.js

const {FrontlineFontConfigWebpackPlugin} = require("@akqa-frontline/font-config-webpack-plugin")

module.exports = {
    plugins: [
        new FrontlineFontConfigWebpackPlugin()
    ]
}
```

Take a look at [webpack-config](https://github.com/akqa-frontline/frontline/tree/master/packages/webpack-config) for instructions on a more complete Frontline webpack configuration.

## Contributing

Please refer to the [contributing](https://github.com/akqa-frontline/frontline/blob/master/CONTRIBUTING.md) document.

## License

ISC © AKQA
