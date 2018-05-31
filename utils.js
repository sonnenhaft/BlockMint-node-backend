const express = require('express');
const client = require('./redis');
const {createWalletFromPassword, USER_MAP_WALLET_PASSWORD} = require('./redis');
const rejectHandler = require('./rejectHandler')
const router = express.Router();

router.get('/:wallet', rejectHandler(async (req, res) => {
    const wallet = req.params.wallet;
    if (!wallet) {
        req.status(404).send('please send valid wallet');
    } else {
        const password = await client.hget(USER_MAP_WALLET_PASSWORD, wallet);
        if (!password) {
            req.status(404).send('such wallet is not registered');
        } else {
            res.send({password, wallet});
        }
    }
}));

router.post('/:password', w(async (req, res) => {
    const password = req.params.password || '';
    const wallet = await createWalletFromPassword(password);
    res.send({wallet})
}));

module.exports = router;