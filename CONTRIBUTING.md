## Submitting a Pull Request

Good pull requests, such as patches, improvements, and new features, are a fantastic help. They should remain focused in scope and avoid containing unrelated commits.

Please **ask first** if somebody else is already working on this or the core developers think your feature is in-scope for Create React App. Generally always have a related issue with discussions for whatever you are including.

Please also provide a **test plan**, i.e. specify how you verified that your addition works.

## Folder Structure of akqa-frontline

`akqa-frontline` is a monorepo, meaning it is divided into independent sub-packages.<br>
These packages can be found in the [`packages/`](https://github.com/akqa-frontline/frontline/tree/master/packages) directory.

### Overview of directory structure

```
packages/
  asset-config-webpack-plugin/
  eslint-config-frontline/
  font-config-webpack-plugin/
  generator-frontline/
  image-config-webpack-plugin/
  js-config-webpack-plugin/
  scss-config-webpack-plugin/
  stylelint-config-frontline/
  webpack-config
```

### Package Descriptions

#### *-config-webpack-plugin

The webpack plugins are a collection of configurations for webpack, based primarily on [create-react-app](https://github.com/facebook/create-react-app).
They contain best practices and can be used as Plugins in a webpack configuration.

#### generator-frontline

A Yeoman generator which can be used to quickly scaffold out new projects, giving you our recommended file and folder setup, dependencies and tools.

#### webpack-config

This package contains a factory for creating webpack configuration, based primarily on [create-react-app](https://github.com/facebook/create-react-app).
While the *-config-webpack-plugin packages handle configuration of loaders for different file formats, the webpack-config contains configuration for things like webpack-dev-server, entry, output, optimization and more. 

#### eslint-config-frontline & stylelint-config-frontline

Rules and configurations for code-quality and formatting.

## Setting Up a Local Copy

1. Clone the repo with `git clone https://github.com/akqa-frontline/frontline`

2. Run `npm install` in the root `frontline` folder.

3. Run `npm run bootstrap` in the root `frontline` folder.

Once it is done, you can modify any file locally and run `npm run test` or `npm run build`.

If you make a change to a package, you should test it end-to-end by implementing / testing your change,
in the `performance` folder. This folder contains a client-like SPA setup where we can test anything related to consuming any of the packages.

To work with the `performance` app, first run `npm install` in the `performance` folder.
All packages in this mono-repo are referenced in the `package.json` by an absolute path.

When ever you build the TypeScript source code of a package, it can be used right away in the `performance` app. 

## Writing a commit

This mono-repo uses commitizen and the [conventional-changelog](https://www.conventionalcommits.org/en/v1.0.0/) specification.

Before you write your commit you must make sure tests are still passing. Run the tests with `npm run test` from the root `frontline` folder.
After the tests are passed, all files that have changed since last commit will be formatted by Prettier.

When you are ready to write your commit, stage the files in question and use the following command in the root `frontline` folder:
`npm run commit`

This will present you with an interactive CLI that will help you choose the correct commit message format.

## Cutting a Release

**THIS IS SUBJECT TO CHANGE WHEN WE ADD A C/I SETUP**

Before you release the latest version of the packages to npm you will need an npm account, a github account and access token, and to authorize yourself with the before-mentioned services using their respective command line commands.

Any changes to *packages* must have a respective pull-request and approval. When the PR has been reviewed, you can merge this in to the master branch.
Please bundle changes (multiple PRs) to keep version bumps to a minimum - if there are multiple approved PR's these should all be merged before making a release.

In the master branch, follow these steps to release the packages:
1. Pull the latest changes - this should be any number of merged PRs.
2. Run `npm run build` in the root `frontline` folder.
3. Run `npm run test` in the root `frontline` folder.

*if tests are passing you are ready to release the packages*
1. Run `npm run release` and follow the interactive CLI.
2. If all went well, congratulations!

When you run `npm run release` Commitizen and Lerna will automate updating changelogs, tagging a release on Github and publishing the packages to the npm registry.
