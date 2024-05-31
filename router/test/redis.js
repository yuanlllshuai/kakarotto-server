const Redis = require('ioredis');
const redis = new Redis();
// redis.set('mykey', 'hhh')
// redis.keys('*').then(res=>{
//     console.log(res)
// })
const num = Math.round(Math.random() * 30 + 1);
const str = 'qwwefrhtyjyukuik';
const strtap = Math.round(Math.random() * 11 + 0);

console.log(1111, num, strtap)

async function map() {
    const data = await redis.zscore('hots', str[strtap])
    if (data) {
        // 自增+1
        await redis.zincrby('hots', 1, str[strtap])
    } else {
        const write = await redis.zadd('hots', num, str[strtap]);
    }

    const sort = await redis.zrevrange('hots', 0, -1, 'withscores');
    console.log(sort);
}

map();