const redis = require('./redis');
const express = require('express');

const toArray = map => {
    return Object.keys(map).map(key => {
        try {
            return JSON.parse(map[key])
        } catch (e) {
            return null
        }
    }).filter(val => !!val)
};

const router = express.Router();

router.get('/', (req, res) => {
    redis.hgetall('UserTable', (error, value) => {
        res.send(toArray(value))
    })
});

router.get('/:id', (req, res) => {
    redis.hget('UserTable', req.params.id, (error, value) => {
        if (!value) {
            res.send(404)
        } else {
            res.send((!error && value) ? JSON.stringify(value) : error)
        }
    })
});

router.put('/:id', (req, res) => {
    let newId = req.body.id;
    redis.hset('UserTable', newId, req.body, (error) => {
        if (error) {
            res.send({error})
        } else {
            res.send(req.body)
        }
    });
});

router.put('/:id', (req, res) => {
    redis.hset('UserTable', req.params.id, req.body, (error) => {
        if (error) {
            res.send({error})
        } else {
            res.send(req.body)
        }
    });
});

router.delete((req, res) => {
    redis.del('UserTable', req.id);
    res.send(200);
});

module.exports = router;