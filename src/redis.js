const redis = require('redis');

const REDIS_URL = `redis://localhost:6379`; // it is default url
const client = redis.createClient(REDIS_URL);

client.on('error', err => console.log(`Error ${err}`));

[
    {username: 'User 1', password: '123456'},
    {username: 'User 2', password: '123456'},
    {username: 'User 3', password: '123456'},
    {username: 'User 4', password: '123456'},
].forEach((user) => {
    client.hset('UserTable', user.id, JSON.stringify(user));
});

[
    {username: 'http://ya.ru', name: 'hello'},
    {username: 'http://google.ru', name: 'hello'}
].forEach((user) => {
    client.hset('VpnTable', user.id, JSON.stringify(user));
});

module.exports = client;

module.exports.REDIS_URL = REDIS_URL;