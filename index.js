const express = require('express');
const swaggerUi = require('swagger-ui-express');
const redis = require('./redis');
const REDIS_URL = redis.REDIS_URL;
const app = express();
const RedisRouterFactory = require('./RedisRouterFactory');

// app.use(require('cors')());
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded());

app.use('/api/v1/user', RedisRouterFactory('UserTable', 'username'));
app.use('/api/v1/vpn', RedisRouterFactory('VpnTable', 'name'));

app.use('/', swaggerUi.serve, swaggerUi.setup(require('yamljs').load('./api-docs.swagger.v1.yaml')));

const SERVER_PORT = 3002;

redis.on('connect', () => {
    console.info('Connected to redis on url', REDIS_URL);

    app.listen(SERVER_PORT, () => {
        console.info('App is listening port:', SERVER_PORT);
    });
});
