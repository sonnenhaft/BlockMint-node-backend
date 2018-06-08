const express = require('express');
const rejectHandler = require('./rejectHandler');
const {redis, USER_LIST_ADDRESS_XMR, checkIfUserExists} = require('./redis');

const router = express.Router();

router.get('/', rejectHandler(async (req, res) => {
    let XMRs = await redis.lrange(USER_LIST_ADDRESS_XMR, 0, -1);
    XMRs = (XMRs || []).reverse().map(xmr => JSON.parse(xmr));
    res.send(XMRs);
}));

router.get('/:address', checkIfUserExists, rejectHandler(async (req, res) => {
    let XMRs = await redis.lrange(`${USER_LIST_ADDRESS_XMR}:${req.params.address}`, 0, -1);
    XMRs = (XMRs || []).reverse().map(xmr => JSON.parse(xmr));
    res.send(XMRs);
}, 'address'));

const sendXmrToPool = (address, body) => {
    console.warn('TODO(vlad): specify access to pool');
    return Promise.resolve()
};

router.post('/:address', checkIfUserExists, rejectHandler(async (req, res) => {
    const address = req.params.address;

    await sendXmrToPool(address, res,body);
    const data = JSON.stringify({address, ...res.body});
    await redis.lpush(`${USER_LIST_ADDRESS_XMR}:${address}`, data);
    await redis.lpush(USER_LIST_ADDRESS_XMR, data);
    res.send({message: 'XMR was sent to pool and stored in the system'});
}, 'address'));

module.exports = router;