const REDIS_URL = 'redis://localhost:6379'; // it is default url

const asyncRedis = require('async-redis');
const client = asyncRedis.createClient(REDIS_URL);

client.on('error', err => console.log(`Error ${err}`));

const getWalletAddress = async () => {
    return await Promise.resolve(`${Date.now()}`)
};

const USER_MAP_WALLET_PASSWORD = 'user:map:wallet-password';

const createWalletFromPassword = async (password) => {
    const wallet = await getWalletAddress();

    await client.hset(USER_MAP_WALLET_PASSWORD, wallet, password);
    return wallet
};

const VPN_LIST = 'vpn:list';

const setVpnUrls = async (urlsList) => {
    await client.del(VPN_LIST);
    await Promise.all(urlsList.map(url => {
        return client.lpush(VPN_LIST, url);
    }));
};

module.exports = client;
module.exports.createWalletFromPassword = createWalletFromPassword;
module.exports.REDIS_URL = REDIS_URL;
module.exports.setVpnUrls = setVpnUrls;
module.exports.VPN_LIST = VPN_LIST;
module.exports.USER_MAP_WALLET_PASSWORD = USER_MAP_WALLET_PASSWORD;