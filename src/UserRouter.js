const redis = require('./redis');
const express = require('express');

const toArray = map => Object.keys(map).map(key => {
    try {
        return JSON.parse(map[key])
    } catch (e) {
        return null
    }
}).filter(val => !!val);

const router = express.Router();

router.get('/', (req, res) => {
    redis.hgetall('UserTable', (error, value) => {
        res.send(toArray(value))
    })
});

router.get('/:id', (req, res) => {
    redis.hget('UserTable', req.params.id, (error, value) => {
        if (error) {
            res.status(500).send(error)
        } else if (!value) {
            res.status(404).send()
        } else {
            res.send(value)
        }
    })
});

router.post('/', (req, res) => {
    let newId = req.body.id;
    redis.hset('UserTable', newId, JSON.stringify(req.body), (error) => {
        if (error) {
            res.send({error})
        } else {
            res.send(req.body)
        }
    });
});

router.put('/:id', (req, res) => {
    redis.hset('UserTable', req.params.id, JSON.stringify(req.body), (error) => {
        if (error) {
            res.status(500).send({error})
        } else {
            res.send(req.body)
        }
    });
});

router.delete('/:id', (req, res) => {
    redis.hget('UserTable', req.params.id, (error, user) => {
        if (!user) {
            res.status(404).send()
        } else {
            redis.del('UserTable', req.params.id, () => {
                res.send('ok');
            });
        }
    })
});

module.exports = router;