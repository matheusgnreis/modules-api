# E-Com Plus Mods REST API

## List endpoints

[https://apx-mods.e-com.plus/api/v1/](https://apx-mods.e-com.plus/api/v1/)

## Modules JSON Schema reference

### Calculate shipping

Triggered to calculate shipping options, must return calculated values and times.

- [Request](https://apx-mods.e-com.plus/api/v1/calculate_shipping/schema.json?store_id=100)
- [Response](https://apx-mods.e-com.plus/api/v1/calculate_shipping/response_schema.json?store_id=100)

### List payments

Triggered when listing payments, must return available methods.

- [Request](https://apx-mods.e-com.plus/api/v1/list_payments/schema.json?store_id=100)
- [Response](https://apx-mods.e-com.plus/api/v1/list_payments/response_schema.json?store_id=100)

### Apply discount

Triggered to validate and apply discount value, must return discount and conditions.

- [Request](https://apx-mods.e-com.plus/api/v1/apply_discount/schema.json?store_id=100)
- [Response](https://apx-mods.e-com.plus/api/v1/apply_discount/response_schema.json?store_id=100)

### Create transaction

Triggered when order is being closed, must create payment transaction and return info.

- [Request](https://apx-mods.e-com.plus/api/v1/create_transaction/schema.json?store_id=100)
- [Response](https://apx-mods.e-com.plus/api/v1/create_transaction/response_schema.json?store_id=100)
