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
        trim: true,
        required: 'Please supply a body for your post',
    },
    codeSandboxId: {},
});

module.exports = mongoose.model('Post', postSchema);
