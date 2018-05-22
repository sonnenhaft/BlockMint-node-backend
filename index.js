const redis = require('./src/redis');
const REDIS_URL = redis.REDIS_URL;

const express = require('express');

const app = express();
app.use(require('body-parser').json());
app.use('/user', require('./src/UserRouter'));

const SERVER_PORT = 3002;

redis.on('connect', () => {
    console.info('Connected to redis on url', REDIS_URL);

    app.listen(SERVER_PORT, () => {
        console.info('App is listening port:', SERVER_PORT);
    });
});

