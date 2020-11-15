const mongoose = require('mongoose');

const { Schema } = mongoose;

const repostSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Repost', repostSchema);
