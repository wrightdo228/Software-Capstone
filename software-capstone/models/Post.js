const mongoose = require('mongoose');

const { Schema } = mongoose;

const Comment = new Schema({
    comment: {
        type: String,
        required: 'Please supply a body for your comment',
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: { type: Date, default: Date.now },
});

Comment.add({ replies: [Comment] });

const postSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: 'Please supply a title',
    },
    postBody: {
        type: String,
        required: 'Please supply a body for your post',
    },
    codeSandboxId: {
        type: String,
    },
    createdAt: { type: Date, default: Date.now },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    comments: [Comment],
    favorites: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Favorite',
        },
    ],
    reposts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Repost',
        },
    ],
    featured: {
        type: Boolean,
        default: false,
    },
    featuredOn: {
        type: Date,
    },
});

module.exports = mongoose.model('Post', postSchema);
