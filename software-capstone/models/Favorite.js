const mongoose = require('mongoose');

const { Schema } = mongoose;

const favoriteSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Favorite', favoriteSchema);
