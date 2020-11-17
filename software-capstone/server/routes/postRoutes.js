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

router.get('/main-feed', authenticate, async (req, res) => {
    const posts = await Post.find();

    res.json(posts).send();
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

router.post('/favorite', authenticate, async (req, res, next) => {
    try {
        const { postId } = req.body;

        const post = await Post.findById(postId);

        if (!post) {
            res.status(404).statusMessage = 'No post could be found';
            res.send();
            next();
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404).statusMessage = 'No user could be found';
            res.send();
            next();
        }

        const newFavorite = new Favorite();
        newFavorite.post = post;
        newFavorite.user = user;
        const favorite = await newFavorite.save();

        user.favorites.push(favorite);
        await user.save();

        res.status(200).send();
    } catch {
        res.status(500).send();
    }
});

router.get('/', authenticate, async (req, res) => {});

module.exports = router;
