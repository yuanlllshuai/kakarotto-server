const express = require('express');
const router = express.Router();
const videoController = require('../controller/videoController');
const { verifyToken } = require('../util/jwt')
const validator = require('../middleware/validator/videoValidator')

router
    .get(
        '/lists',
        verifyToken(),
        videoController.list
    )
    .get(
        '/details/:vid',
        verifyToken(false),
        videoController.detail
    )
    .post(
        '/createVideo',
        verifyToken(),
        validator.createVideo,
        videoController.createVideo
    )
    .post(
        '/comment/:vid',
        verifyToken(),
        videoController.comment
    )
    .get(
        '/commentList/:vid',
        videoController.commentList
    )
    .delete(
        '/commentList/:vid/:cid',
        verifyToken(),
        videoController.deleteComment
    )
    .get(
        '/like/:vid',
        verifyToken(),
        videoController.like
    )
    .get(
        '/dislike/:vid',
        verifyToken(),
        videoController.dislike
    )
    .get(
        '/likeList',
        verifyToken(),
        videoController.likeList
    )
    .get(
        '/collect/:vid',
        verifyToken(),
        videoController.collect
    )
    .get(
        '/hots/:topNum',
        videoController.hots
    );

module.exports = router;