const {
    redis,
    setVpnUrls,
    USER_MAP_ADDRESS_PASSWORD,
    USER_LIST_ADDRESS,
    VPN_LIST
} = require('./redis');

(async () => {
    try {
        await [
            redis.del(USER_MAP_ADDRESS_PASSWORD),
            redis.del(USER_LIST_ADDRESS),
            redis.del(VPN_LIST),
            ...['123456', 'querty', 'admin'].map((address => {
                const password = Math.round(Math.random() * 1000);
                return Promise.all([
                    redis.hset(USER_MAP_ADDRESS_PASSWORD, address, password),
                    redis.lpush(USER_LIST_ADDRESS, JSON.stringify({address, password}))
                ]);
            })),
            setVpnUrls([
                {url: 'http://ya.ru', country: 'Ru'},
                {url: 'http://google.ru', country: 'US'}
            ])
        ];
        console.log('test users and vpn list created');
    } catch (e) {
        console.warn('db was not initialized')
        console.error(e);
    }
})();
