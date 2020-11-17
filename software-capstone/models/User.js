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
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', userSchema);
