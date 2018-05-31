const express = require('express');
const rejectHandler = require('./rejectHandler');
const redis = require('./redis');
const {createWalletFromPassword, USER_MAP_WALLET_PASSWORD} = require('./redis');

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

router.post('/:password', rejectHandler(async (req, res) => {
    const password = req.params.password || '';
    const wallet = await createWalletFromPassword(password);
    res.send({wallet})
}));

module.exports = router;