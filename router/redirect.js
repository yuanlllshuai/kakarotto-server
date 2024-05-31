const express = require('express');
const router = express.Router();
const redirectController = require('../controller/redirectController');

router
    .get('/baidu', redirectController.baidu)

module.exports = router;