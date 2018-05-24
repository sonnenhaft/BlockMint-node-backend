const express = require('express');
const {promisify} = require('util');
const redis = require('./redis');

const toArray = map => Object.keys(map).map(key => {
    try {
        return JSON.parse(map[key])
    } catch (e) {
        return null
    }
}).filter(val => !!val);

const getItem = promisify(redis.hget);
const removeItem = promisify(redis.del);
const setItem = promisify(redis.hset);

const checkExist = (tableName, id) => getItem(tableName, id).then(item => {
    return item || Promise.reject('not found')
});

const getErrStatus = error => error === 'not found' ? 404 : 500;

module.exports = (tableName, key = 'id') => {
    const router = express.Router();

    router.get('/', (req, res) => {
        redis.hgetall(tableName, (error, value) => {
            res.send(toArray(value))
        })
    });

    router.get(`/:${key}`, (req, res) => {
        let status = 200;
        checkExist(tableName, req.params[key]).catch(error => {
            status = getErrStatus(error);
            return error
        }).then((value) => {
            res.status(status).send(value)
        });
    });


    router.post('/', (req, res) => {
        console.log(tableName, key, req.body[key])
        getItem(tableName, req.body[key]).catch(e => e).then((result) => {
            console.log(result)
            if (result !== 'not found') {
                return Promise.reject('already exist')
            }
        }).then(() => {
            return setItem(tableName, req.body[key], JSON.stringify(req.body))
        }).catch(error => {
            res.send(500, error);
            return Promise.reject(error)
        }).then(() => {
            res.send(req.body)
        });
    });

    router.put(`/:${key}`, (req, res) => {
        let status = 200;
        checkExist(tableName, req.params[key]).then(ignoredItem => {
            return setItem(tableName, req.params[key], JSON.stringify(req.body));
        }).catch(error => {
            status = getErrStatus(error);
            return error
        }).then((message) => {
            res.status(status || 200).send(message || req.body)
        });
    });

    router.delete(`/:${key}`, (req, res) => {
        let status = 200;
        checkExist(tableName, req.params[key]).then(ignoredItem => {
            return removeItem(tableName, req.params[key]);
        }).catch(error => {
            status = getErrStatus(error);
            return error
        }).then((message) => {
            res.status(status).send(message || 'ok')
        });
    });

    return router;
};