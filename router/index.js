const express = require('express');
const router = express.Router();
router.use('/user', require('./user'));
router.use('/video', require('./video'));
router.use('/redirect', require('./redirect'));
module.exports = router;