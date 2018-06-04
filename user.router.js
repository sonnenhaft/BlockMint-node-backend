const express = require('express');
const rejectHandler = require('./rejectHandler');
const redis = require('./redis');
const {USER_MAP_WALLET_PASSWORD} = require('./redis');

const router = express.Router();

router.get('/:wallet/info', rejectHandler(async (req, res) => {
    const wallet = req.params.wallet;
    if (!wallet) {
        req.status(404).send('please send valid wallet');
    } else {
        const password = await redis.hget(USER_MAP_WALLET_PASSWORD, wallet);
        if (!password) {
            req.status(404).send('such wallet is not registered');
        } else {
            res.send({password, wallet});
        }
    }
}));

const formidable = require('formidable');

const fs = require('fs');
const rename = require('util').promisify(fs.rename).bind(fs);
let UPLOAD_DIR = './uploaded-keys';
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR)
}

router.post('/', (req, res) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = UPLOAD_DIR;
    form.on('fileBegin', (name, file) => {
        file.path = `${UPLOAD_DIR}/${file.name}`;
    });
    form.parse(req, async (fileParseError, fields, files) => {
        const address = fields.address;
        await rename(`${UPLOAD_DIR}/${files.file.name}`, `${UPLOAD_DIR}/${address}`);
        await redis.hset(USER_MAP_WALLET_PASSWORD, address, fields.password);
        res.status(200).send('File uploaded, user and password stored in db');
    });
});

module.exports = router;