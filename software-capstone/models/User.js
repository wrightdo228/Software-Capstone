const mongoose = require('mongoose');

const { Schema } = mongoose;
const validator = require('validator');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid email address'],
        required: 'Please supply an email address',
    },
    username: {
        type: String,
        unique: true,
        trim: true,
        required: 'Please supply a username',
    },
    normalizedUsername: {
        type: String,
        unique: true,
        uppercase: true,
        trim: true,
        // required: true,
    },
    avatar: {
        type: String,
    },
    createdAt: { type: Date, default: Date.now },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post',
        },
    ],
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
    postCollections: [
        {
            type: Schema.Types.ObjectId,
            ref: 'PostCollection',
        },
    ],
    role: {
        type: String,
        enum: ['user', 'admin', 'super-admin'],
        default: 'user',
    },
    status: {
        type: String,
        enum: ['active', 'banned'],
        default: 'active',
    },
    accountActivated: {
        type: Boolean,
        default: false,
    },
    following: [{ type: Schema.ObjectId, ref: 'User' }],
    followers: [{ type: Schema.ObjectId, ref: 'User' }],
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', userSchema);
