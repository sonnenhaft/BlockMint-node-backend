const redis = require('redis');

const REDIS_URL = `redis://localhost:6379`; // it is default url
const client = redis.createClient(REDIS_URL);

client.on('error', err => console.log(`Error ${err}`));

[
    {id: 1, username: 'User 1'},
    {id: 2, username: 'User 2'},
    {id: 3, username: 'User 3'},
    {id: 4, username: 'User 4'}
].forEach((user) => {
    client.hset('UserTable', user.id, JSON.stringify(user));
});

module.exports = client;

module.exports.REDIS_URL = REDIS_URL;