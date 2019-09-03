# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.10.0](https://github.com/ecomclub/modules-api/compare/v0.9.2...v0.10.0) (2019-09-03)


### ⚠ BREAKING CHANGES

* **list-payments:** response fields removed, edited or deprecated

* **list-payments:** update payment info fields ([e5d3f82](https://github.com/ecomclub/modules-api/commit/e5d3f82))

### [0.9.2](https://github.com/ecomclub/modules-api/compare/v0.9.1...v0.9.2) (2019-09-03)


### Bug Fixes

* atualizando de acordo com as recomendações ([912e7d4](https://github.com/ecomclub/modules-api/commit/912e7d4))
* tentativa de correção do erro 4 utilizando o modelo sugerido na doc ([05f1118](https://github.com/ecomclub/modules-api/commit/05f1118))
* tentativa de correção do erro 7 ([f2abe49](https://github.com/ecomclub/modules-api/commit/f2abe49))


### Features

* **cancel-order:** cancel order when transaction fails ([321c379](https://github.com/ecomclub/modules-api/commit/321c379))
* **list-payments:** returning more default infos ([2ca9fa8](https://github.com/ecomclub/modules-api/commit/2ca9fa8))
* **payments-history:** add entry to payments history after checkout ([9e25912](https://github.com/ecomclub/modules-api/commit/9e25912))

### 0.9.1 (2019-08-01)


### Bug Fixes

* **checkout:** fix handling shipping total price and price ([760fadc](https://github.com/ecomclub/modules-api/commit/760fadc))
* **checkout:** validate prop from response object when selecting result ([77cd063](https://github.com/ecomclub/modules-api/commit/77cd063))
* check app state (enumered) instead of status ([3b53bfa](https://github.com/ecomclub/modules-api/commit/3b53bfa))
* fix debugging errors (log data) ([fcc46c5](https://github.com/ecomclub/modules-api/commit/fcc46c5))
* fix handling request options object ([aa8faf3](https://github.com/ecomclub/modules-api/commit/aa8faf3))
* get app id from result object ([164a2db](https://github.com/ecomclub/modules-api/commit/164a2db))
* handling fields for transaction.app object ([0c33f1c](https://github.com/ecomclub/modules-api/commit/0c33f1c))
* increase cmax content lenght and debug axios error ([e128d54](https://github.com/ecomclub/modules-api/commit/e128d54))
* minor log format fix for axios errors ([cba5d7a](https://github.com/ecomclub/modules-api/commit/cba5d7a))
* mount request body object inside appsloop ([9f0124d](https://github.com/ecomclub/modules-api/commit/9f0124d))
* return response data even with error status code ([a3fc0cb](https://github.com/ecomclub/modules-api/commit/a3fc0cb))
* return response data even with error status code (always string) ([38a939c](https://github.com/ecomclub/modules-api/commit/38a939c))
* return response data even with error status code (only if object) ([c461573](https://github.com/ecomclub/modules-api/commit/c461573))
* setup transaction app object ([4929d9c](https://github.com/ecomclub/modules-api/commit/4929d9c))
* stop using 'multipleOf' to treat decimals ([4dde7a4](https://github.com/ecomclub/modules-api/commit/4dde7a4))


### Features

* count request->response time (ms) ([a48898a](https://github.com/ecomclub/modules-api/commit/a48898a))
* set order_id to create transaction body ([285fd28](https://github.com/ecomclub/modules-api/commit/285fd28))
* setup transaction app object (intermediator data) ([d99a816](https://github.com/ecomclub/modules-api/commit/d99a816))
