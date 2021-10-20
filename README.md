# modules-api
E-Com Plus Mods API Node.js App

[REST API reference](https://developers.e-com.plus/modules-api/)

# Technology stack
+ [NodeJS](https://nodejs.org/en/) 12.x
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
