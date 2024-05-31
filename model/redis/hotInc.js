const { redis } = require('./index');

exports.hotInc = async (vid, incNum) => {
    const data = await redis.zscore('videohots', vid);
    let inc = null;
    if (data) {
        inc = await redis.zincrby('videohots', incNum, vid);
    } else {
        inc = await redis.zadd('videohots', incNum, vid);
    }
    return inc;
}

exports.topHots = async (num) => {
    const sort = await redis.zrevrange('videohots', 0, -1, 'withscores');
    const list = sort.slice(0, num * 2);
    const obj = {};
    list.forEach((i, index) => {
        if (1 % 2 === 0) {
            obj[list[i]] = list[i + 1]
        }
    });
    return obj;
}