const { body } = require('express-validator');
const validator = require('./errorBack');
const { Video } = require('../../model');

module.exports.createVideo = validator([
    body('title')
        .notEmpty().withMessage('视频名不能为空')
        .isLength({ max: 20 }).withMessage('视频名长度不能大于20'),
    body('vid')
        .notEmpty().withMessage('视频ID不能为空')
]);