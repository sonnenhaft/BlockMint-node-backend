const express = require('express');
const swaggerUi = require('swagger-ui-express');
const {redis, REDIS_URL} = require('./redis');
const app = express();


app.use(require('cors')());

app.use('/', express.static(require('path').join(__dirname + '/static')));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(require('yamljs').load('./api-docs.swagger.v1.yaml')));

app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({extended: false}));

app.use('/user', require('./user.router'));
app.use('/vpn', require('./vpn.router'));
app.use('/xmr', require('./xmr.router'));



const SERVER_PORT = 3002;

redis.on('connect', async () => {
    console.info('Connected to redis on url', REDIS_URL);

    await require('./init-demo-db');

    app.listen(SERVER_PORT, () => {
        console.info('App is listening port:', SERVER_PORT);
    });
});
