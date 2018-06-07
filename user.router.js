const express = require('express')
const rejectHandler = require('./rejectHandler')
const {redis, USER_MAP_ADDRESS_PASSWORD, USER_LIST_ADDRESS, checkIfUserExists, getBalanceTable} = require('./redis')

const router = express.Router()

router.get('/', rejectHandler(async (req, res) => {
    const list = await redis.lrange(USER_LIST_ADDRESS, 0, -1);

    const users = (list || []).map(stringUser => ({...JSON.parse(stringUser)}));
    const balances = await Promise.all(users.map(({address}) => getBalance(address)))
    users.forEach((user, idx) => user.balance = balances[idx])

    res.send(users);
}))

const getBalance = async (address) => {
    const balanceArray = (await redis.lrange(getBalanceTable(address), 0, -1)) || []
    return balanceArray.reduce(((val, item) => val + (item - 0)), 0);
}

router.get('/:address', checkIfUserExists, rejectHandler(async (req, res) => {
    const address = req.params.address
    const password = await redis.hget(USER_MAP_ADDRESS_PASSWORD, address)
    res.send({password, address, balance: await getBalance(address)})
}))


router.post('/:address/balance', checkIfUserExists, rejectHandler(async (req, res) => {
    const address = req.params.address;
    await redis.lpush(getBalanceTable(address), req.body.amount)
    res.send({balance: await getBalance(address)})
}))

const formidable = require('formidable')

const fs = require('fs')
const rename = require('util').promisify(fs.rename).bind(fs)
let UPLOAD_DIR = './uploaded-keys'
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR)
}

router.post('/', (req, res) => {
    const form = new formidable.IncomingForm()
    form.uploadDir = UPLOAD_DIR

    form.on('fileBegin', (name, file) => {
        file.path = `${UPLOAD_DIR}/${file.name}`
    })

    form.parse(req, async (fileParseError, {address, password}, {file}) => {
        const params = {address, password, file}
        const error = ['address', 'password', 'file'].reduce((error, key) => {
            return params[key] ? error : error + `Field "${key} can not be empty. `
        }, '');

        if (error) {
            res.status(400).send(error)
        } else {
            if (await redis.hget(USER_MAP_ADDRESS_PASSWORD, address)) {
                res.status(409).send('User with such address already exists.')
            } else {
                await rename(`${UPLOAD_DIR}/${file.name}`, `${UPLOAD_DIR}/${address}`)
                await redis.hset(USER_MAP_ADDRESS_PASSWORD, address, password)
                redis.lpush(USER_LIST_ADDRESS, JSON.stringify({address, password}))
                res.status(200).send('File uploaded, user and password stored in db')
            }
        }
    })
})

module.exports = router