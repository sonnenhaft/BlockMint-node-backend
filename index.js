const express = require('express');
const swaggerUi = require('swagger-ui-express');
const redis = require('./redis');
const REDIS_URL = redis.REDIS_URL;
const app = express();

// app.use(require('cors')());
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({extended:false}));
// app.use(require('express-fileupload')());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:false}));

app.use('/user', require('./user.router'));
app.use('/vpn', require('./vpn.router'));
app.use('/xmr', require('./xmr.router'));



app.use('/', swaggerUi.serve, swaggerUi.setup(require('yamljs').load('./api-docs.swagger.v1.yaml')));

const SERVER_PORT = 3002;

redis.on('connect', async () => {
    console.info('Connected to redis on url', REDIS_URL);

    await require('./init-demo-db');

    app.listen(SERVER_PORT, () => {
        console.info('App is listening port:', SERVER_PORT);
    });
});
