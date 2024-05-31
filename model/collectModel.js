const mongoose = require('mongoose');
const baseModel = require('./baseModel');

const collectSchema = new mongoose.Schema({
    video: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'Video'
    },
    user: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'User'
    },
    ...baseModel
});

module.exports = collectSchema;