const mongoose = require('mongoose');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/express-video');
}

main().then((res) => {
    console.log('数据库连接成功');
}).catch((err) => {
    console.log('数据库连接失败', err);
});

module.exports = {
    User: mongoose.model('User', require('./userModel')),
    Video: mongoose.model('Video', require('./videoModel')),
    Subscribe: mongoose.model('Subscribe', require('./subscribeModel')),
    Comment: mongoose.model('Comment', require('./commentModel')),
    Like: mongoose.model('Like', require('./likeModel')),
    Collect: mongoose.model('Collect', require('./collectModel')),
}