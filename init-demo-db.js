const redis = require('./redis');
const {
    setVpnUrls,
    USER_MAP_WALLET_PASSWORD,
    VPN_LIST
} = require('./redis');

// (async () => {
//     await [
//         await redis.del(USER_MAP_WALLET_PASSWORD),
//         await redis.del(VPN_LIST),
//         setVpnUrls(['http://ya.ru', 'http://google.ru'])
//     ];
//     console.log('test users and vpn list created');
// })();
