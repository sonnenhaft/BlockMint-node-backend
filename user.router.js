const express = require('express')
const rejectHandler = require('./rejectHandler')
const redis = require('./redis')
const { USER_MAP_WALLET_PASSWORD } = require('./redis')

const router = express.Router()

router.get('/:address', rejectHandler(async (req, res) => {
    const address = req.params.address
    if ( !address ) {
        res.status(400).send('This request require waller address in url')
    } else {
        const password = await redis.hget(USER_MAP_WALLET_PASSWORD, address)
        if ( !password ) {
            res.status(404).send('such wallet address is not registered')
        } else {
            res.send({ password, address })
        }
    }
}, 'address'))

const formidable = require('formidable')

const fs = require('fs')
const rename = require('util').promisify(fs.rename).bind(fs)
let UPLOAD_DIR = './uploaded-keys'
if ( !fs.existsSync(UPLOAD_DIR) ) {
    fs.mkdirSync(UPLOAD_DIR)
}

router.post('/', (req, res) => {
    const form = new formidable.IncomingForm()
    form.uploadDir = UPLOAD_DIR

    form.on('fileBegin', (name, file) => {
        file.path = `${UPLOAD_DIR}/${file.name}`
    })

    form.parse(req, async (fileParseError, { address, password }, { file }) => {
        const params = { address, password, file }
        const error = ['address', 'password', 'file'].reduce((error, key) => {
            return params[key] ? error : error + `Field "${key} can not be empty. `
        }, '');

        if (error) {
            res.status(400).send(error)
        } else {
            if (await redis.hget(USER_MAP_WALLET_PASSWORD, address)) {
                res.status(409).send('User with such address already exists.')
            } else {
                await rename(`${UPLOAD_DIR}/${file.name}`, `${UPLOAD_DIR}/${address}`)
                await redis.hset(USER_MAP_WALLET_PASSWORD, address, password)
                res.status(200).send('File uploaded, user and password stored in db')
            }

        }
    })
})

module.exports = router