const express = require('express');
const rejectHandler = require('./rejectHandler');
const redis = require('./redis');
const {VPN_LIST, setVpnUrls} = require('./redis');

const router = express.Router();

router.get('/', rejectHandler(async (req, res) => {
    res.send(await redis.lrange(VPN_LIST, 0, -1));
}));

router.post('/', rejectHandler(async (req, res) => {
    const urls = req.body;
    await setVpnUrls(urls);
    res.status(200).send('Urls updated')
}));

module.exports = router;