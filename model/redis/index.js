const Redis = require('ioredis');
const redis = new Redis();

redis.on('error', err => {
    if (err) {
        redis.quit();
    }
});

redis.on('ready', () => {
    console.log('Redis 连接成功')
});

exports.redis = redis;