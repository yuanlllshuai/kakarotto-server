const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const validator = require('../middleware/validator/userValidator')
const { verifyToken } = require('../util/jwt')
const multer = require('multer');
const upload = multer({ dest: 'public/' });

router
    .get('/getChannel', verifyToken(), userController.getChannel)
    .get('/getSubscribe/:userId', userController.getSubscribe)
    .get('/getUser/:userId', verifyToken(false), userController.getUser)
    .get('/unsubscribe/:userId', verifyToken(), userController.unsubscribe)
    .get('/subscribe/:userId', verifyToken(), userController.subscribe)
    .post(
        '/registers',
        validator.register,
        userController.register
    )
    .post(
        '/logins',
        validator.login,
        userController.login
    )
    .get('/lists', verifyToken(), userController.list)
    .put('/', verifyToken(), validator.update, userController.update)
    .post('/avatars', verifyToken(), upload.single('avatar'), userController.avatar)
    .delete('/', userController.delete)

module.exports = router;