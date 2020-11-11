const mongoose = require('mongoose');

const { Schema } = mongoose;

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
});

module.exports = mongoose.model('Post', postSchema);
