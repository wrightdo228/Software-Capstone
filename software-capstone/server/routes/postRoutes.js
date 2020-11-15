const express = require('express');
const mongoose = require('mongoose');
const authenticate = require('../middleware/authenticate');

const User = mongoose.model('User');
const Post = mongoose.model('Post');
const Favorite = mongoose.model('Favorite');
const Repost = mongoose.model('Repost');

const router = express.Router();

function getSandboxId(sandboxLink) {
    const url = new URL(sandboxLink);

    if (url.host.toLowerCase() === 'codesandbox.io') {
        const splitPath = url.pathname.toLowerCase().trim().split('/');
        const { length } = splitPath;

        if (length > 1) {
            const id = splitPath[length - 1];
            return id;
        }
    }

    return null;
}

router.post('/', authenticate, async (req, res) => {
    try {
        const { sandboxLink } = req.body;
        const userId = req.user._id;

        const newPost = new Post({
            title: req.body.title,
            postBody: req.body.postBody,
        });

        if (sandboxLink) {
            const sandboxId = getSandboxId(sandboxLink);

            if (sandboxId) {
                newPost.sandboxId = sandboxId;
            } else {
                res.status(400).send();
            }
        }

        const user = await User.findById(userId);
        newPost.user = user;

        const post = await newPost.save();

        user.posts.push(post);

        await user.save();

        res.json(post).status(201).send();
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

router.post('/repost', authenticate, async (req, res) => {
    const { postId } = req;

    const post = await Post.findById(postId);
    const user = await User.findById(req.user._id);

    const repost = new Repost();
    repost.post = post;
    repost.user = user;
    await repost.save();
});

router.post('/favorite', authenticate, async (req, res) => {});

router.get('/', authenticate, async (req, res) => {});

module.exports = router;
