# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.9.0-rc.0](https://github.com/akqa-frontline/frontline/compare/v0.8.1...v0.9.0-rc.0) (2020-06-11)


### Bug Fixes

* **scss-config-webpack-plugin:** resolve json files relative to root ([1cb8af4](https://github.com/akqa-frontline/frontline/commit/1cb8af40b24cae9754fe4f5be9d249702ebd5902))


### Features

* **generate-injection-html-webpack-plugin:** generate "partial" html files for injection and loadin ([b7ab71b](https://github.com/akqa-frontline/frontline/commit/b7ab71b6386bb103570b0dddf91a6aef46f19e87))





## [0.8.1](https://github.com/akqa-frontline/frontline/compare/v0.8.0...v0.8.1) (2020-06-03)

**Note:** Version bump only for package frontline







## [0.7.2](https://github.com/akqa-frontline/frontline/compare/v0.7.1...v0.7.2) (2020-06-01)


### Bug Fixes

* **webpack-config:** upgrade webpack-manifest-plugin ([#15](https://github.com/akqa-frontline/frontline/issues/15)) ([04a8996](https://github.com/akqa-frontline/frontline/commit/04a899659ac1a83569160bc7a5e64b9d6dd99289))






## [0.7.1](https://github.com/akqa-frontline/frontline/compare/v0.7.0...v0.7.1) (2020-03-03)


### Bug Fixes

* **webpack-config:** add browserslist env name to chunks and entry filenames in development mode ([#11](https://github.com/akqa-frontline/frontline/issues/11)) ([0323a9d](https://github.com/akqa-frontline/frontline/commit/0323a9d81dad7814a209a3aafacdf8aa167e6006))





# [0.7.0](https://github.com/akqa-frontline/frontline/compare/v0.6.2...v0.7.0) (2020-02-20)


### Bug Fixes

* **js-config-webpack-plugin:** do not ship core-js to modern browsers ([2e83ca5](https://github.com/akqa-frontline/frontline/commit/2e83ca5c898e0301de75018fb6ea5ad826389b4f))


### Features

* **webpack-config:** when defining a (s)css file as entry point, no longer generate runtime or any ([7bd6d6b](https://github.com/akqa-frontline/frontline/commit/7bd6d6b0418e006cee8700abbf113223e8ce15e8))





## [0.6.2](https://github.com/akqa-frontline/frontline/compare/v0.6.0...v0.6.2) (2020-02-19)


### Bug Fixes

* **repo:** a bogus release was created for 0.6.0 containing no published files ([5d43620](https://github.com/akqa-frontline/frontline/commit/5d436209094eac8e9a409b85ff25051ee4af4b1c))
* **webpack-config:** do not import/export FrontlineBabelConfig ([c595417](https://github.com/akqa-frontline/frontline/commit/c595417ed8e166546f58efdf3995b7804c266390))





# [0.6.0](https://github.com/akqa-frontline/frontline/compare/v0.5.0...v0.6.0) (2020-02-19)


### Features

* **eslint-config-frontline:** add eslint-config-frontline package ([f734430](https://github.com/akqa-frontline/frontline/commit/f734430fb566d5e5a71928f73db62ca1780a42e2))
* **stylelint-config-frontline:** add stylelint-config-frontline package ([ec5a9d7](https://github.com/akqa-frontline/frontline/commit/ec5a9d7c2eba2860eac1a6db460541a6773c604d))





# [0.5.0](https://github.com/akqa-frontline/frontline/compare/v0.4.0...v0.5.0) (2020-02-10)


### Features

* **js-config-webpack-plugin, webpack-config:** migrate FrontlineBabelConfig to the js-config-webpack ([0423155](https://github.com/akqa-frontline/frontline/commit/0423155fa97a2071f934906b3262e963fa2d2af1))





# [0.4.0](https://github.com/akqa-frontline/frontline/compare/v0.3.2...v0.4.0) (2020-02-05)


### Bug Fixes

* **webpack-config:** support multiple entry points in asset-manifest ([cc18805](https://github.com/akqa-frontline/frontline/commit/cc18805d314181e446b015c0a419afcfbd1e2621))


### Features

* **webpack-config:** add support for .env files, add interpolate-html-webpack-plugin ([d33a91e](https://github.com/akqa-frontline/frontline/commit/d33a91e99b854ffb9578d49727378321057c6607))





## [0.3.2](https://github.com/akqa-frontline/frontline/compare/v0.3.1...v0.3.2) (2020-02-05)

**Note:** Version bump only for package frontline





## [0.3.1](https://github.com/akqa-frontline/frontline/compare/v0.3.0...v0.3.1) (2020-01-24)


### Bug Fixes

* **webpack-config:** allow webpack.entry to be single string, array or map ([5c624cf](https://github.com/akqa-frontline/frontline/commit/5c624cf5839ab1527cae68b1c03863204465f873))





# [0.3.0](https://github.com/akqa-frontline/frontline/compare/v0.2.0...v0.3.0) (2020-01-20)


### Bug Fixes

* **js-config-webpack-plugin:** remove unsupported svgr option ([692b6da](https://github.com/akqa-frontline/frontline/commit/692b6daa054a727a22adf662c654d020a85661e8))
* **scss-config-webpack-plugin:** support default options, correct spelling ([bbc259f](https://github.com/akqa-frontline/frontline/commit/bbc259f6c09c5c62dc06d88610254e44f25f75fe))


### Features

* **scss-config-webpack-plugin:** sass-loader and related packages major version ([b4359b0](https://github.com/akqa-frontline/frontline/commit/b4359b07cb60cde442132d200ed06e141efb5655))
* **webpack-config:** refactor webpack-config ([58d1815](https://github.com/akqa-frontline/frontline/commit/58d18159ceff2623858683f27aaa0c562946470d))





# 0.2.0 (2019-11-05)


### Features

* initial commit ([96aa68c](https://github.com/akqa-frontline/frontline/commit/96aa68c334de5bc6c7f107598ed9fcedc7917af1))
