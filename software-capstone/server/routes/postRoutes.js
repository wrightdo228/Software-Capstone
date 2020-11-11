const express = require('express');
const mongoose = require('mongoose');

const Post = mongoose.model('Post');

const router = express.Router();

router.post('/', async (req, res) => {
    const newPost = new Post({
        user: req.user._id,
        title: 'Test title',
        postBody: 'random post body',
    });

    const post = await newPost.save().catch((error) => console.error(error));

    res.json(post).status(200).send();
});

module.exports = router;
