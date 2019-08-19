# modules-api
E-Com Plus Mods API Node.js App

# Technology stack
+ [NodeJS](https://nodejs.org/en/) 8.9.x
+ [REST Auto Router](https://github.com/leomp12/nodejs-rest-auto-router) npm package

# Setting up
```bash
git clone https://github.com/ecomclub/modules-api
cd modules-api
cp config/config-sample.json config/config.json
nano config/config.json
```

Edit `config.json` placing correct values for your environment,
after that, start app with node:

```bash
node ./main.js
```

# Web server
You need to use a web server such as NGINX or Apache HTTP,
proxy passing the requests to configured TCP port.

# Issues for tests
- [ ] First test:
[List installments with client JS SDK](https://github.com/ecomclub/modules-api/issues/6)

Docs:
- [Developers](developers.e-com.plus)
- [API Modules](https://github.com/ecomclub/modules-api/tree/master/docs)


- [ ] Second test:
[Add payment history to order on checkout](https://github.com/ecomclub/modules-api/issues/7)

Docs:
- [Developers](https://developers.e-com.plus/docs/api/#/store/orders/orders)
- [API Modules](https://github.com/ecomclub/modules-api/tree/master/docs)

# How to do it?
Create a fork to your own account, then edit and push to your fork. So create a pull request to us. Then we will validate or not.
