# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.12.37](https://github.com/ecomplus/modules-api/compare/v0.12.36...v0.12.37) (2021-10-18)


### Bug Fixes

* **modules:** reverts https://github.com/ecomplus/modules-api/commit/394aa6c1409c51c42a37eb586c17e3436429eaa0 ([75a26a1](https://github.com/ecomplus/modules-api/commit/75a26a1c81bbb9dfe61369255996a9141b18c8e8))

### [0.12.36](https://github.com/ecomplus/modules-api/compare/v0.12.35...v0.12.36) (2021-10-18)


### Bug Fixes

* **modules:** set connection timeout 3s ([394aa6c](https://github.com/ecomplus/modules-api/commit/394aa6c1409c51c42a37eb586c17e3436429eaa0))

### [0.12.35](https://github.com/ecomplus/modules-api/compare/v0.12.34...v0.12.35) (2021-10-18)


### Bug Fixes

* **applications:** properly checking empry params before set defaults ([eae9724](https://github.com/ecomplus/modules-api/commit/eae97243c251f40550049e06208697b70f8a9a28))

### [0.12.34](https://github.com/ecomplus/modules-api/compare/v0.12.33...v0.12.34) (2021-10-18)

### [0.12.33](https://github.com/ecomplus/modules-api/compare/v0.12.32...v0.12.33) (2021-10-18)

### [0.12.32](https://github.com/ecomplus/modules-api/compare/v0.12.31...v0.12.32) (2021-07-23)


### Bug Fixes

* **calculate-shipping:** update valid warehouse codes regex (add uppercase chars and -) ([680d8a2](https://github.com/ecomplus/modules-api/commit/680d8a2e423770a0c80a4d5afd0f91ea09597334))

### [0.12.31](https://github.com/ecomplus/modules-api/compare/v0.12.30...v0.12.31) (2021-06-02)


### Features

* **calculate-shipping:** `pick_up`, `scheduled_delivery` and `delivery_instructions` on response ([3f1b69c](https://github.com/ecomplus/modules-api/commit/3f1b69ce0b0c6621429d3f561bb275c498095761))
* **create-transaction:** add optional `payment_instructions` field to response schema ([f30ec3d](https://github.com/ecomplus/modules-api/commit/f30ec3d11655a2c06923be77a511ee3fb8dff14e))

### [0.12.30](https://github.com/ecomplus/modules-api/compare/v0.12.29...v0.12.30) (2021-05-27)

### [0.12.29](https://github.com/ecomplus/modules-api/compare/v0.12.28...v0.12.29) (2021-05-27)


### Features

* **list-paymenst:** add `earn_percentage` field to loyalty points program object ([93d06b2](https://github.com/ecomplus/modules-api/commit/93d06b2f0c4d3d9a2fe3e69d3021fa3108de43a2))

### [0.12.28](https://github.com/ecomplus/modules-api/compare/v0.12.27...v0.12.28) (2021-05-20)


### Bug Fixes

* **create-transaction:** set `credit_card.hash` max chars to 6k ([e197039](https://github.com/ecomplus/modules-api/commit/e197039d9a951a9e608d46a7ecf9b710ae62d8a0))

### [0.12.27](https://github.com/ecomplus/modules-api/compare/v0.12.26...v0.12.27) (2021-05-14)


### Features

* **list-payments:** add `min_subtotal_to_earn` field to loyalty points programs object ([b75a623](https://github.com/ecomplus/modules-api/commit/b75a6235d6df0f2124081646f35f0e3f756a86d8))

### [0.12.26](https://github.com/ecomplus/modules-api/compare/v0.12.25...v0.12.26) (2021-05-14)


### Bug Fixes

* **applications:** when app id is set, limit fetching one app installation only ([b645ead](https://github.com/ecomplus/modules-api/commit/b645eadbe00fcea3682a765a3cf390cacf4d9704))
* **checkout:** check transactions array length to proceed to next one ([1e4fb79](https://github.com/ecomplus/modules-api/commit/1e4fb7984a7d5bc6f8530e00a8ddcb4ea2b136d7))
* **checkout:** check transactions array length to proceed to next one ([cddb375](https://github.com/ecomplus/modules-api/commit/cddb375f3571045fa998fae3fcb34da9a0ee50ab))
* **checkout:** properly set customer id on all transactions ([4c350fb](https://github.com/ecomplus/modules-api/commit/4c350fb1094f0ac39c12683de96202a69aaaeeb7))
* **create-transaction:** update schema to accept `amount_part` minimum to 0 ([8b1fbeb](https://github.com/ecomplus/modules-api/commit/8b1fbeb9a29c60b865ae9e3cb3b9220cb4ba4e54))

### [0.12.25](https://github.com/ecomplus/modules-api/compare/v0.12.24...v0.12.25) (2021-05-13)


### Bug Fixes

* **checkout:** sum production time to posting deadline instead of delivery time ([1dbd3e2](https://github.com/ecomplus/modules-api/commit/1dbd3e26d7d0f645e788641b0fa7768a654f0e63))
* **checkout:** sync process multiple transactions, list payments for first transaction only ([e0f55be](https://github.com/ecomplus/modules-api/commit/e0f55be6e4290d065b6b372b95216da0f470c827))

### [0.12.24](https://github.com/ecomplus/modules-api/compare/v0.12.23...v0.12.24) (2021-05-13)


### Features

* **checkout:** sum production time to shipping deadline ([#14](https://github.com/ecomplus/modules-api/issues/14)) ([4290b9d](https://github.com/ecomplus/modules-api/commit/4290b9d4c4aec73087cdee4f4ddb46bad071c7f3))


### Bug Fixes

* **checkout:** mannually fix amount for multiple transactions ([2bc436a](https://github.com/ecomplus/modules-api/commit/2bc436a7f33bec5e356d4ec87a88da3770675e9d))
* **checkout:** properly handle multiple transactions (only) ([a995acb](https://github.com/ecomplus/modules-api/commit/a995acba2e747eef35609520b2ac27abf4c63a94))

### [0.12.23](https://github.com/ecomplus/modules-api/compare/v0.12.22...v0.12.23) (2021-05-11)


### Bug Fixes

* **checkout:** prevent (stupid) error with repeated item flags ([203191a](https://github.com/ecomplus/modules-api/commit/203191a6cdc79866bf5a1c340d67fb910f696ce7))

### [0.12.22](https://github.com/ecomplus/modules-api/compare/v0.12.21...v0.12.22) (2021-05-07)


### Features

* **checkout:** support `amount_part` number to handle 2+ transactions ([237f46a](https://github.com/ecomplus/modules-api/commit/237f46a9e9708c7d16e623cfa1cbdaf854508504))


### Bug Fixes

* **checkout:** compare transactions amount sum with order total value ([cf0cdb5](https://github.com/ecomplus/modules-api/commit/cf0cdb51096481d1318af6c0f931b654e0304409))

### [0.12.21](https://github.com/ecomplus/modules-api/compare/v0.12.20...v0.12.21) (2021-05-06)


### Features

* **checkout:** supporting multiple transactions ([efd45da](https://github.com/ecomplus/modules-api/commit/efd45daf9b9ebdaf7a4155a34b7e96a2647c7fff))
* **create-transaction:** supporting response with `loyalty_points` object ([e5d4d30](https://github.com/ecomplus/modules-api/commit/e5d4d30861144e54494c64cd782a6952bc2acdd9))


### Bug Fixes

* **checkout:** prevent multiple error responses on multiple transactions ([747e0a6](https://github.com/ecomplus/modules-api/commit/747e0a68d03c1f60aedb8df1c2b36829d02b2abf))
* **checkout:** properly continue loop to next transaction on done ([c0ae96a](https://github.com/ecomplus/modules-api/commit/c0ae96a1a65242be444419449cbd5a32f675c6be))
* **checkout:** properly continue loop to next transaction on done ([e9ed2c9](https://github.com/ecomplus/modules-api/commit/e9ed2c971275bf9f0680d1f4f745bed8ba8f453b))
* **list-payments:** use `loyalty_points_programs.$.ratio` to repeat store api schema ([5a01f22](https://github.com/ecomplus/modules-api/commit/5a01f22e90c209fae6a9d0022011c54716a1007c))

### [0.12.20](https://github.com/ecomplus/modules-api/compare/v0.12.19...v0.12.20) (2021-05-03)


### Features

* **calculate-shipping:** supporting warehouses for multi cd ([6613dfc](https://github.com/ecomplus/modules-api/commit/6613dfc7cedef3460042e899945ef6c91f88c9db))
* **checkout:** set order `opened_at` datetime ([3419eb2](https://github.com/ecomplus/modules-api/commit/3419eb2f5ce6821fb7894fdbf1b10440d19ea7f1))
* **create-transaction:** add `loyalty_points_applied` request param ([d995868](https://github.com/ecomplus/modules-api/commit/d995868d66f789158191a1983ed567d0eb81e892))
* **list-payments:** optional `loyalty_points_programs` response field ([ef530e1](https://github.com/ecomplus/modules-api/commit/ef530e12af0234bb0b0bec0a2eaf5c3ebd084c57))

### [0.12.19](https://github.com/ecomplus/modules-api/compare/v0.12.18...v0.12.19) (2020-12-09)


### Bug Fixes

* **checkout:** fix checking/setting payment gateway ([3206606](https://github.com/ecomplus/modules-api/commit/3206606866dccf30fb98a320e58f90cfdce3e829))

### [0.12.18](https://github.com/ecomplus/modules-api/compare/v0.12.17...v0.12.18) (2020-12-09)


### Features

* **list-payments:** edit response to accept 'discount_option.apply_at' ([9f26a0b](https://github.com/ecomplus/modules-api/commit/9f26a0b59f2b06a3e757045b22d5c57d3f940c1b))


### Bug Fixes

* **checkout:** prefer respective method name to select payemnt gateway ([1cbe4b7](https://github.com/ecomplus/modules-api/commit/1cbe4b7e06500a8eb041aa5493c1fc817cffdc13))

### [0.12.17](https://github.com/ecomplus/modules-api/compare/v0.12.16...v0.12.17) (2020-11-12)


### Bug Fixes

* **checkout:** fix setting min packs num for kit ([3b3b06d](https://github.com/ecomplus/modules-api/commit/3b3b06d784daaeb8329cc8f9b818099a036bfd7c))

### [0.12.16](https://github.com/ecomplus/modules-api/compare/v0.12.15...v0.12.16) (2020-11-12)


### Features

* **checkout:** handling kit product from checkout items ([fd50fea](https://github.com/ecomplus/modules-api/commit/fd50fea22c8f2022d6985441b91cf01a74116f75))

### [0.12.15](https://github.com/ecomplus/modules-api/compare/v0.12.14...v0.12.15) (2020-10-26)


### Features

* **fix-items:** handling additional prices from customization fields ([ba8786b](https://github.com/ecomplus/modules-api/commit/ba8786b7ed3d01d45a1c88cc55f099268867dea0))

### [0.12.14](https://github.com/ecomplus/modules-api/compare/v0.12.13...v0.12.14) (2020-08-26)


### Features

* **checkout:** set order links if empty (checkout and status) ([73fd896](https://github.com/ecomplus/modules-api/commit/73fd89638892f0988ab0579d6177aa12a61fcdf4))

### [0.12.13](https://github.com/ecomplus/modules-api/compare/v0.12.12...v0.12.13) (2020-08-12)


### Bug Fixes

* **applications:** validating app id param ([71cde3c](https://github.com/ecomplus/modules-api/commit/71cde3c2f25f22c598361dbb97bed9cd7b022930))

### [0.12.12](https://github.com/ecomplus/modules-api/compare/v0.12.11...v0.12.12) (2020-08-03)


### Features

* **checkout:** add 'notes' field to entry schema ([897d1cb](https://github.com/ecomplus/modules-api/commit/897d1cb3f82ec9e90b75f6e7379afe6e6987139d))


### Bug Fixes

* **checkout:** bypass some order fields ([1688d33](https://github.com/ecomplus/modules-api/commit/1688d3305330503a7a54d0554a57220258941ee5))

### [0.12.11](https://github.com/ecomplus/modules-api/compare/v0.12.10...v0.12.11) (2020-06-06)


### Bug Fixes

* **checkout:** checkout steps to shipping -> discount -> payment ([a5d2ae1](https://github.com/ecomplus/modules-api/commit/a5d2ae1a538867c4a7b145a21e74cdf29609da86))

### [0.12.10](https://github.com/ecomplus/modules-api/compare/v0.12.9...v0.12.10) (2020-06-06)

### [0.12.9](https://github.com/ecomplus/modules-api/compare/v0.12.8...v0.12.9) (2020-06-05)


### Bug Fixes

* **checkout:** stop hard removing order body items by flags ([c965cd9](https://github.com/ecomplus/modules-api/commit/c965cd9eddb84111145d5bcf90fe25688caf831d))

### [0.12.8](https://github.com/ecomplus/modules-api/compare/v0.12.7...v0.12.8) (2020-06-05)


### Bug Fixes

* **checkout:** fix checking freebit product ids (match items) ([a779a68](https://github.com/ecomplus/modules-api/commit/a779a68e435ee05d76e18a2fd55e1f9fc777d3d3))

### [0.12.7](https://github.com/ecomplus/modules-api/compare/v0.12.6...v0.12.7) (2020-06-05)


### Bug Fixes

* **checkout:** accept items flags on request body ([eb2b2a7](https://github.com/ecomplus/modules-api/commit/eb2b2a7b25016847e6202cf18d859453f61323d5))

### [0.12.6](https://github.com/ecomplus/modules-api/compare/v0.12.5...v0.12.6) (2020-06-05)


### Bug Fixes

* **checkout:** fix handling freebie items (force final price) ([831e16f](https://github.com/ecomplus/modules-api/commit/831e16f76afd603b14a282944f772ec1194f72f7))

### [0.12.5](https://github.com/ecomplus/modules-api/compare/v0.12.4...v0.12.5) (2020-06-05)


### Features

* **apply-discount:** add optional 'freebie_product_ids' to response ([28d245d](https://github.com/ecomplus/modules-api/commit/28d245df709a98dcc80f9ac7c7d3dbfa6129d445))

### [0.12.4](https://github.com/ecomplus/modules-api/compare/v0.12.3...v0.12.4) (2020-05-23)


### Bug Fixes

* **list-payments:** prevent error with discount object without value ([022520d](https://github.com/ecomplus/modules-api/commit/022520dcc25bcb4db408c9d1ead05ac3fb7896c3))

### [0.12.3](https://github.com/ecomplus/modules-api/compare/v0.12.2...v0.12.3) (2020-05-21)


### Bug Fixes

* **checkout:** list payments first, then proceed to discounts ([c12597b](https://github.com/ecomplus/modules-api/commit/c12597bf8a16367104093e125fb13413eac6f748))

### [0.12.2](https://github.com/ecomplus/modules-api/compare/v0.12.1...v0.12.2) (2020-04-18)


### Features

* **list-payments:** add  to js client object ([1694407](https://github.com/ecomplus/modules-api/commit/1694407d0841b22bfe174dcb1c94617d66b56de4))

### [0.12.1](https://github.com/ecomplus/modules-api/compare/v0.12.0...v0.12.1) (2020-04-10)


### Bug Fixes

* **apply-discount:** accepting discount value less than 1 ([12b95dd](https://github.com/ecomplus/modules-api/commit/12b95dd3594b561b5ce9099fd4403b6bcc9d2e97))

## [0.12.0](https://github.com/ecomplus/modules-api/compare/v0.11.22...v0.12.0) (2020-04-09)


### Bug Fixes

* **modules:** add break lines to tmp log, debug with json stringify ([82a48e9](https://github.com/ecomplus/modules-api/commit/82a48e9ecba07bed404e14c4833d2d4ac42630ab))
* **modules:** stop trying to debug circular response structure ([4acd1ad](https://github.com/ecomplus/modules-api/commit/4acd1add43dd4d42eef235436bc7db6e86b1d2fa))

### [0.11.22](https://github.com/ecomplus/modules-api/compare/v0.11.21...v0.11.22) (2020-04-09)


### Features

* **debug:** tmp log file with for current app request and response ([e402be3](https://github.com/ecomplus/modules-api/commit/e402be37740b06650a48963126e118f93b859354))

### [0.11.21](https://github.com/ecomplus/modules-api/compare/v0.11.20...v0.11.21) (2020-04-09)


### Bug Fixes

* **checkout:** try to debug app responde on create transaction error ([25e6d52](https://github.com/ecomplus/modules-api/commit/25e6d521e82e1dfc079c98910787717968993044))

### [0.11.20](https://github.com/ecomplus/modules-api/compare/v0.11.19...v0.11.20) (2020-04-05)


### Bug Fixes

* **checkout:** trying list of valid results for each module ([94f582e](https://github.com/ecomplus/modules-api/commit/94f582e65e54df84295fbe11e4fbc446d9e9bc24))

### [0.11.19](https://github.com/ecomplus/modules-api/compare/v0.11.18...v0.11.19) (2020-03-26)


### Bug Fixes

* **checkout:** return 409 (conflict) when merchant/app config is wrong ([36ab2eb](https://github.com/ecomplus/modules-api/commit/36ab2ebc1bca1b23a9536c38c4c6950981c79db8)), closes [#5](https://github.com/ecomplus/modules-api/issues/5)

### [0.11.18](https://github.com/ecomclub/modules-api/compare/v0.11.17...v0.11.18) (2020-02-05)


### Bug Fixes

* **fix-items:** check promotional price with date ranges ([e7ca1c9](https://github.com/ecomclub/modules-api/commit/e7ca1c9))

### [0.11.17](https://github.com/ecomclub/modules-api/compare/v0.11.16...v0.11.17) (2020-01-27)


### Bug Fixes

* **checkout:** fix checkout schema moving some props from transaction ([9ce7742](https://github.com/ecomclub/modules-api/commit/9ce7742))

### [0.11.16](https://github.com/ecomclub/modules-api/compare/v0.11.15...v0.11.16) (2020-01-26)


### Features

* **appy-discount:** add 'available_extra_discount' field (utm in shelf) ([50b6aa1](https://github.com/ecomclub/modules-api/commit/50b6aa1))

### [0.11.15](https://github.com/ecomclub/modules-api/compare/v0.11.14...v0.11.15) (2020-01-23)


### Bug Fixes

* **apply-discount:** update customer object schema ([c7eabcf](https://github.com/ecomclub/modules-api/commit/c7eabcf))

### [0.11.14](https://github.com/ecomclub/modules-api/compare/v0.11.13...v0.11.14) (2020-01-15)


### Bug Fixes

* **list-payments:** add param to check support for 'fetch_when_selected' ([8d6ebac](https://github.com/ecomclub/modules-api/commit/8d6ebac))

### [0.11.13](https://github.com/ecomclub/modules-api/compare/v0.11.12...v0.11.13) (2020-01-15)


### Features

* **list-payments:** add req/res props to support fetch when selected ([0e01063](https://github.com/ecomclub/modules-api/commit/0e01063))

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
