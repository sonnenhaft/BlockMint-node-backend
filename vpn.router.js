const express = require('express');
const rejectHandler = require('./rejectHandler');
const {redis, VPN_LIST, setVpnUrls} = require('./redis');

const router = express.Router();

router.get('/', rejectHandler(async (req, res) => {
    console.log('ok here')
    res.send(await redis.lrange(VPN_LIST, 0, -1));
}));

router.post('/', rejectHandler(async (req, res) => {
    await setVpnUrls(req.body);
    res.status(200).send('URLs updated')
}));

module.exports = router;