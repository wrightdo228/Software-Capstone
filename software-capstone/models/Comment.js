const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema({
    commentBody: {
        type: String,
        required: 'Please supply a body for your comment',
    },
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

module.exports = mongoose.model('Comment', commentSchema);
