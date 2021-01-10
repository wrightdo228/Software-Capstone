const mongoose = require('mongoose');

const { Schema } = mongoose;

const favoriteSchema = new Schema({
    postCollection: {
        type: Schema.Types.ObjectId,
        ref: 'PostCollection',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CollectionFavorite', favoriteSchema);
