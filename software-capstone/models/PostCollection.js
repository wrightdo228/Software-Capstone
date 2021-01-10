const mongoose = require('mongoose');

const { Schema } = mongoose;

const postCollectionSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: 'Please supply a title',
    },
    description: {
        type: String,
        trim: true,
        required: 'Please supply a description',
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    contributors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post',
        },
    ],
    image: {
        type: String,
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PostCollection', postCollectionSchema);
