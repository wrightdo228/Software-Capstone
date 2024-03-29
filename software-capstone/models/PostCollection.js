const mongoose = require('mongoose');

const { Schema } = mongoose;

const postCollectionSchema = new Schema({
    title: {
        type: String,
        trim: true,
        maxlength: 100,
        required: 'Please supply a title',
    },
    description: {
        type: String,
        maxLength: 320,
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
    isPrivate: {
        type: Boolean,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    featured: {
        type: Boolean,
    },
    featuredOn: {
        type: Date,
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PostCollection', postCollectionSchema);
