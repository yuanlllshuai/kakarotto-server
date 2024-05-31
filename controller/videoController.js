const { Video, Comment, Like, Collect } = require('../model/index');
const { hotInc, topHots } = require('../model/redis/hotInc');

exports.list = async (req, res) => {
    const { offset = 1, size = 10 } = req.body;
    const lists = await Video.find()
        .skip((offset - 1) * size)
        .limit(size)
        .sort({ creatAt: -1 })
        .populate('user');//关联查询
    const count = await Video.countDocuments();
    res.status(200).json({ lists, count });
}

exports.createVideo = async (req, res) => {
    const body = req.body;
    body.user = req.user.userInfo._id;
    const videoModel = new Video(body);
    try {
        const dbBack = await videoModel.save();
        res.status(201).json({ dbBack })
    } catch (error) {
        res.status(500).json({ err: error })
    }
}

exports.detail = async (req, res) => {
    const { vid } = req.params;
    const details = Video.findById(vid).populate('user', '_id username');
    await hotInc(vid, 1);
    res.status(200).json({ details });
}

exports.comment = async (req, res) => {
    const { vid } = require.params;
    const videoInfo = await Video.findById(videoId);
    if (!videoInfo) {
        return res.status(404).json({ err: '视频不存在' })
    }
    const comment = await new Comment({
        content: req.body / content,
        video: vid,
        user: req.user.userInfo._id
    }).save();
    videoInfo.commentCount += 1;
    await videoInfo.save();
    await hotInc(vid, 2);
    res.status(201).json(comment);
}

exports.commentList = async (req, res) => {
    const { vid } = req.params;
    const { offset = 1, size = 10 } = req.body;
    const comments = await Comment
        .find({ video: vid })
        .skip((offset - 1) * size)
        .limit(size)
        .populate('user', '_id username image');
    const count = await Video.countDocuments({ video: vid });
    res.status(200).json({ comments, count });
}

exports.deleteComment = async (req, res) => {
    const { vid, cid } = req.params;
    const videoInfo = await Video.findById(vid);
    if (!videoInfo) {
        return res.status(404).json({ err: '视频不存在' })
    }
    const comment = await Comment.findById(cid);
    if (!comment) {
        return res.status(404).json({ err: '评论不存在' })
    }
    if (!comment.user.equals(req.user.userInfo._id)) {
        return res.status(403).json({ err: '评论不可删除' })
    }
    await comment.remove();
    videoInfo.commentCount -= 1;
    await videoInfo.save();
    res.status(200).json({ msg: '删除成功' })
}

exports.like = async (req, res) => {
    const { vid } = req.params;
    const userId = req.user.userInfo._id;
    const video = await Video.findById(vid);
    if (!video) {
        return res.status(404).json({ err: '视频不存在' })
    }
    const record = await Like.findOne({
        user: userId,
        video: vid
    });
    if (record && record.like === 1) {
        await record.remove()
    } else if (record && record.like === -1) {
        record.like = 1;
        await record.save();
        await hotInc(vid, 2);
    } else {
        await new Like({
            user: userId,
            video: vid,
            like: 1
        }).save();
        await hotInc(vid, 2);
    }
    video.likeCount = await Like.countDocuments({
        video: vid,
        like: 1
    });
    video.dislikeCount = await Like.countDocuments({
        video: vid,
        like: -1
    });
    await video.save();
    res.status(200).json(video.toJSON())
}

exports.dislike = async (req, res) => {
    const { vid } = req.params;
    const userId = req.user.userInfo._id;
    const video = await Video.findById(vid);
    if (!video) {
        return res.status(404).json({ err: '视频不存在' })
    }
    const record = await Like.findOne({
        user: userId,
        video: vid
    });
    if (record && record.like === -1) {
        await record.remove()
    } else if (record && record.like === 1) {
        record.like = -1;
        await record.save();
    } else {
        await new Like({
            user: userId,
            video: vid,
            like: -1
        }).save()
    }
    video.likeCount = await Like.countDocuments({
        video: vid,
        like: 1
    });
    video.dislikeCount = await Like.countDocuments({
        video: vid,
        like: -1
    });
    await video.save();
    res.status(200).json(video.toJSON())
}

exports.likeList = async (req, res) => {
    const userId = req.user.userInfo._id;
    const { offset = 1, size = 10 } = req.body;
    const likes = await Like
        .find({ like: 1, user: userId })
        .skip((offset - 1) * size)
        .limit(size)
        .populate('video', '_id title user');
    const count = await Like.countDocuments({ like: 1, user: userId });
    res.status(200).json({ likes, count });
}

exports.collect = async (req, res) => {
    const { vid } = req.params;
    const userId = req.user.userInfo._id;
    const video = await Video.findById(vid);
    if (!video) {
        return res.status(404).json({ err: '视频不存在' })
    }
    const record = await Collect.findOne({
        user: userId,
        video: vid
    });
    if (record) {
        return res.status(403).json({ err: '视频已被收藏' })
    }

    const data = await new Collect({
        user: userId,
        video: vid
    }).save();
    if (data) {
        await hotInc(vid, 3);
    }
    res.status(201).json(data);
}

exports.hots = async (req, res) => {
    const { topNum } = req.params;
    const tops = await topHots(topNum);
    res.status(200).json({ tops });
}