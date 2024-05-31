const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const toJwt = promisify(jwt.sign);
const verify = promisify(jwt.verify);

const uuid = 'd5617772-6585-49f5-a47a-b5883e50cdf1';

module.exports.createToken = async (userInfo) => {
    return await toJwt(
        { userInfo },
        uuid,
        {
            expiresIn: 60 * 60 * 24
        }
    );
}

module.exports.verifyToken = (required = true) => async (req, res, next) => {
    let token = req.headers.authorization;
    token = token ? token.split('Bearer ')[1] : null;
    if (token) {
        try {
            let userInfo = await verify(token, uuid);
            req.user = userInfo;
            next();
        } catch (error) {
            res.status(402).json({ error: 'token错误' })
        }
    } else if (required) {
        res.status(402).json({ error: '请传入token' })
    } else {
        next()
    }
}