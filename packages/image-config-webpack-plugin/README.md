# @akqa-frontline/image-config-webpack-plugin

![GitHub](https://img.shields.io/github/license/akqa-frontline/frontline)
![npm (scoped)](https://img.shields.io/npm/v/@akqa-frontline/image-config-webpack-plugin)

_this package is not yet fully documented_

Image configuration for webpack.

## What does it do

This package lets you use image assets in your JS and (S)CSS files.

#### Notable features

- Inline SVG files
- Base64 encodes images less than 10kb

## Install
Install this package and its peer dependencies:

```
npm install --save-dev --save-exact @akqa-frontline/image-config-webpack-plugin
npm install --save-dev --save-exact webpack
```

## Usage

Add the plugin to your webpack configuration

```
// webpack.config.js

const {FrontlineImageConfigWebpackPlugin} = require("@akqa-frontline/image-config-webpack-plugin")

module.exports = {
    plugins: [
        new FrontlineImageConfigWebpackPlugin()
    ]
}
```

Take a look at [webpack-config](https://github.com/akqa-frontline/frontline/tree/master/packages/webpack-config) for instructions on a more complete Frontline webpack configuration.

## Contributing

Please refer to the [contributing](https://github.com/akqa-frontline/frontline/blob/master/CONTRIBUTING.md) document.

## License

ISC © AKQA
