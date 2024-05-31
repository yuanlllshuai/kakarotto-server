const Joi = require('joi');
const { body } = require('express-validator');
const validator = require('./errorBack');
const { User } = require('../../model');

// module.exports.register = async (ctx, next) => {
//     const schema = Joi.object({
//         username: Joi.string().required(),
//         password: Joi.string().min(6).required(),
//         email: Joi.string().email().require(),
//         phone: Joi.string().phone()
//     }).validate(ctx.request.body);
//     if (schema.error) {
//         ctx.throw(400, schema.error)
//     }

//     const { email, phone } = ctx.request.body;

//     const emailValidate = await User.findOne({ email });
//     if (emailValidate) {
//         return ctx.throw(400, '邮箱已被注册')
//     }
//     const phoneValidate = await User.findOne({ phone });
//     if (phoneValidate) {
//         return ctx.throw(400, '手机号已被注册');
//     }
//     await next();
// }

module.exports.register = validator([
    body('username')
        .notEmpty().withMessage('用户名不能为空')
        .isLength({ min: 3 }).withMessage('用户名长度不能小于3'),
    body('email')
        .notEmpty().withMessage('邮箱不能为空')
        .isEmail().withMessage('邮箱不合法')
        .custom(async val => {
            const emailValidate = await User.findOne({ email: val });
            if (emailValidate) {
                return Promise.reject('邮箱已被注册')
            }
        }),
    body('phone')
        .notEmpty().withMessage('手机号不能为空')
        .isMobilePhone().withMessage('手机号不合法')
        .custom(async val => {
            const phoneValidate = await User.findOne({ phone: val });
            if (phoneValidate) {
                return Promise.reject('手机号已被注册')
            }
        }),
    body('password')
        .notEmpty().withMessage('密码不能为空')
        .isLength({ min: 5 }).withMessage('密码长度不能小于5'),
]);

module.exports.login = validator([
    body('email')
        .notEmpty().withMessage('邮箱不能为空')
        .isEmail().withMessage('邮箱不合法')
        .custom(async val => {
            const emailValidate = await User.findOne({ email: val });
            if (!emailValidate) {
                return Promise.reject('邮箱未注册')
            }
        }),
    body('password')
        .notEmpty().withMessage('密码不能为空')
])

module.exports.update = validator([
    body('email')
        // .isEmail().withMessage('邮箱不合法')
        .custom(async val => {
            const emailValidate = await User.findOne({ email: val });
            if (emailValidate) {
                return Promise.reject('邮箱已被注册')
            }
        }),
    body('username')
        .custom(async val => {
            const usernameValidate = await User.findOne({ username: val });
            if (usernameValidate) {
                return Promise.reject('用户名已被注册')
            }
        }),
    body('phone')
        .custom(async val => {
            const phoneValidate = await User.findOne({ phone: val });
            if (phoneValidate) {
                return Promise.reject('手机号已被注册')
            }
        }),
])