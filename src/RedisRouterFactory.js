const redis = require('./redis');
const express = require('express');

const toArray = map => Object.keys(map).map(key => {
    try {
        return JSON.parse(map[key])
    } catch (e) {
        return null
    }
}).filter(val => !!val);

module.exports = (tableName, key = 'id') => {
    const router = express.Router();

    router.get('/', (req, res) => {
        redis.hgetall(tableName, (error, value) => {
            res.send(toArray(value))
        })
    });

    router.get(`/:${key}`, (req, res) => {
        redis.hget(tableName, req.params[key], (error, value) => {
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
        const newId = req.body[key];
        redis.hset(tableName, newId, JSON.stringify(req.body), (error) => {
            if (error) {
                res.send({error})
            } else {
                res.send(req.body)
            }
        });
    });

    router.put(`/:${key}`, (req, res) => {
        redis.hset(tableName, req.params[key], JSON.stringify(req.body), (error) => {
            if (error) {
                res.status(500).send({error})
            } else {
                res.send(req.body)
            }
        });
    });

    router.delete(`/:${key}`, (req, res) => {
        redis.hget(tableName, req.params[key], (error, user) => {
            if (!user) {
                res.status(404).send()
            } else {
                redis.del(tableName, req.params[key], () => {
                    res.send('ok');
                });
            }
        })
    });

    return router;
};