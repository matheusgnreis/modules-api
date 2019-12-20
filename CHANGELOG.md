# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.11.12](https://github.com/ecomclub/modules-api/compare/v0.11.11...v0.11.12) (2019-12-20)


### Bug Fixes

* **checkout:** set transaction status.updated_at ([85cca14](https://github.com/ecomclub/modules-api/commit/85cca14))

### [0.11.11](https://github.com/ecomclub/modules-api/compare/v0.11.10...v0.11.11) (2019-12-20)


### Bug Fixes

* **checkout:** fix default payment history entry datetime ([d2af70b](https://github.com/ecomclub/modules-api/commit/d2af70b))

### [0.11.10](https://github.com/ecomclub/modules-api/compare/v0.11.9...v0.11.10) (2019-12-20)


### Bug Fixes

* **checkout:** ensure amount total decimal fix ([d3baa6c](https://github.com/ecomclub/modules-api/commit/d3baa6c))

### [0.11.9](https://github.com/ecomclub/modules-api/compare/v0.11.8...v0.11.9) (2019-12-20)


### Bug Fixes

* **checkout:** round all amount fields to 2 digits ([c6e15ea](https://github.com/ecomclub/modules-api/commit/c6e15ea))

### [0.11.8](https://github.com/ecomclub/modules-api/compare/v0.11.7...v0.11.8) (2019-12-19)


### Bug Fixes

* **checkout:** must update checkout body amount on fix total ([8f5b943](https://github.com/ecomclub/modules-api/commit/8f5b943))

### [0.11.7](https://github.com/ecomclub/modules-api/compare/v0.11.6...v0.11.7) (2019-12-19)


### Bug Fixes

* **checkout:** apply payment method adding to amount discount ([c266081](https://github.com/ecomclub/modules-api/commit/c266081))
* **checkout:** apply payment method discount only is < extra discount ([c3de424](https://github.com/ecomclub/modules-api/commit/c3de424))

### [0.11.6](https://github.com/ecomclub/modules-api/compare/v0.11.5...v0.11.6) (2019-12-05)

### [0.11.5](https://github.com/ecomclub/modules-api/compare/v0.11.4...v0.11.5) (2019-12-05)


### Bug Fixes

* **debug-requests:** check response object before getting data prop ([56f8f9b](https://github.com/ecomclub/modules-api/commit/56f8f9b))

### [0.11.4](https://github.com/ecomclub/modules-api/compare/v0.11.3...v0.11.4) (2019-12-05)


### Bug Fixes

* **checkout:** try to bypass internal request error usr msg ([56c88b1](https://github.com/ecomclub/modules-api/commit/56c88b1))
* **checkout:** uso deep clone to preserve original req body ([c7f455e](https://github.com/ecomclub/modules-api/commit/c7f455e))

### [0.11.3](https://github.com/ecomclub/modules-api/compare/v0.11.2...v0.11.3) (2019-12-05)


### Bug Fixes

* **checkout:** apply discount (extra discount) before list payments ([41d3d29](https://github.com/ecomclub/modules-api/commit/41d3d29))

### [0.11.2](https://github.com/ecomclub/modules-api/compare/v0.11.1...v0.11.2) (2019-12-05)


### Bug Fixes

* **checkout:** fix amount total after extra discount applied ([17ed0e5](https://github.com/ecomclub/modules-api/commit/17ed0e5))

### [0.11.1](https://github.com/ecomclub/modules-api/compare/v0.11.0...v0.11.1) (2019-11-29)


### Features

* **checkout:** mark internal requests with 'is_checkout_confirmation' ([023536c](https://github.com/ecomclub/modules-api/commit/023536c))

## [0.11.0](https://github.com/ecomclub/modules-api/compare/v0.10.6...v0.11.0) (2019-11-19)


### ⚠ BREAKING CHANGES

* **apply-discount:** schema changed for apply_discount module

### Bug Fixes

* **apply-discount:** fix module response schema ([e1a1c1a](https://github.com/ecomclub/modules-api/commit/e1a1c1a))


### Features

* **checkout:** applying extra discount on checkout endpoint ([31ddec8](https://github.com/ecomclub/modules-api/commit/31ddec8))

### [0.10.6](https://github.com/ecomclub/modules-api/compare/v0.10.5...v0.10.6) (2019-11-18)


### Bug Fixes

* **apply-discount:** remove customer main email (private) by default ([5a44d83](https://github.com/ecomclub/modules-api/commit/5a44d83))
* **page-loaded:** fix schemas for page loaded module ([9218e50](https://github.com/ecomclub/modules-api/commit/9218e50))


### Features

* **apply-discount:** add apply discount module with schemas ([8a5ad70](https://github.com/ecomclub/modules-api/commit/8a5ad70))

### [0.10.5](https://github.com/ecomclub/modules-api/compare/v0.10.4...v0.10.5) (2019-10-22)


### Features

* **list-payments:** add optional props domain and customer ([7a356ac](https://github.com/ecomclub/modules-api/commit/7a356ac))

### [0.10.4](https://github.com/ecomclub/modules-api/compare/v0.10.3...v0.10.4) (2019-10-21)


### Features

* **transaction:** add 'open_payment_id' to create transaction schema ([4993b5a](https://github.com/ecomclub/modules-api/commit/4993b5a))

### [0.10.3](https://github.com/ecomclub/modules-api/compare/v0.10.2...v0.10.3) (2019-10-14)


### Features

* **list-payments:** add 'transaction_promise' on 'js_client' object ([5109eca](https://github.com/ecomclub/modules-api/commit/5109eca))

### [0.10.2](https://github.com/ecomclub/modules-api/compare/v0.10.1...v0.10.2) (2019-10-14)


### Features

* **list-payments:** update schema, add js_client.container_html ([cf9f6ee](https://github.com/ecomclub/modules-api/commit/cf9f6ee))

### [0.10.1](https://github.com/ecomclub/modules-api/compare/v0.10.0...v0.10.1) (2019-09-13)


### Bug Fixes

* **checkout-history:** add date time to created payment history ([4c4ca0f](https://github.com/ecomclub/modules-api/commit/4c4ca0f))

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
