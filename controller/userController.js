const fs = require('fs');
const { promisify } = require('util');
const { User, Subscribe } = require('../model/index');
const { createToken } = require('../util/jwt')

const rename = promisify(fs.rename);

exports.register = async (req, res) => {
    const userModel = new User(req.body);
    const dbBack = await userModel.save();
    const user = dbBack.toJSON();
    Reflect.deleteProperty(user, 'password');
    res.status(201).json({ user });
}

exports.list = async (req, res) => {
    res.send('/user-list');
}

exports.delete = async (req, res) => {
    res.send('/user-delete');
}

exports.login = async (req, res) => {
    let dbBack = await User.findOne(req.body);
    if (!dbBack) {
        res.status(402).json({ error: '邮箱或密码不正确' })
    }
    dbBack = dbBack.toJSON();
    dbBack.token = await createToken(dbBack);
    res.set({
        'Access-Control-Allow-Origin': req.headers.origin || '*',
    });
    res.status(200).json(dbBack);
}

//用户修改
exports.update = async (req, res) => {
    const userId = req.user.userInfo._id;
    const updateData = await User.findByIdAndUpdate(userId, req.body, { new: true });
    res.status(200).json(updateData);
}

//用户头像
exports.avatar = async (req, res) => {
    const fileArr = req.file.originalname.split('.');
    const fileType = fileArr[fileArr.length - 1];
    const filePath = './public/' + req.file.filename;
    const fileName = filePath + '.' + fileType;
    try {
        await rename(
            filePath,
            fileName
        );
        res.status(201).json({ filePath: fileName })
    } catch (error) {
        res.status(500).json({ error })
    }
}

exports.subscribe = async (req, res) => {
    const userId = req.user.userInfo._id;
    const channelId = req.params.userId;
    if (userId === channelId) {
        return res.status(401).json({ err: '不能关注自己' });
    }
    const record = await Subscribe.findOne({
        user: userId,
        channel: channelId
    })
    if (!record) {
        await new Subscribe({
            user: userId,
            channel: channelId
        }).save();
        const user = await User.findById(channelId);
        user.subscribedCount += 1;
        await user.save();
        res.status(200).json({ msg: '关注成功' });
    } else {
        res.status(401).json({ err: '已经订阅了此频道' });
    }
}

exports.unsubscribe = async (req, res) => {
    const userId = req.user.userInfo._id;
    const channelId = req.params.userId;
    if (userId === channelId) {
        return res.status(401).json({ err: '不能取消关注自己' });
    }
    const record = await Subscribe.findOne({
        user: userId,
        channel: channelId
    })
    if (record) {
        await record.remove();
        const user = await User.findById(channelId);
        user.subscribedCount -= 1;
        await user.save();
        res.status(200).json({ user });
    } else {
        res.status(401).json({ err: '还未订阅了此频道' });
    }
}

exports.getUser = async (req, res) => {
    let isSubscribe = false;
    if (req.user) {
        const record = await Subscribe.findOne({
            channel: req.params.userId,
            user: req.user.userInfo._id
        })
        if (record) {
            isSubscribe = true
        }
    }
    const user = await User.findById(req.params.userId);
    res.status(200).json({ ...user, isSubscribe });
}

// 获取订阅的列表
exports.getSubscribe = async (req, res) => {
    const subscribeList = await Subscribe.find({
        user: req.params.userId
    })
    .populate('channel');
    res.status(200).json(subscribeList);
}

// 获取粉丝列表
exports.getChannel= async (req, res) => {
    const channelList = await Subscribe.find({
        channel: req.user.userInfo._id
    }).populate('user');
    res.status(200).json(channelList);
}