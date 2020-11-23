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
            const codeSandboxId = getSandboxId(sandboxLink);

            if (codeSandboxId) {
                newPost.codeSandboxId = codeSandboxId;
            } else {
                return res.status(400).send();
            }
        }

        const user = await User.findById(userId);
        newPost.user = user;

        const post = await newPost.save();

        user.posts.push(post);

        await user.save();

        res.status(201).json(post);
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

router.get('/main-feed', authenticate, async (req, res) => {
    const user = await User.findById(req.user._id);
    const following = [...user.following, user._id];

    const posts = await Post.find({
        user: {
            $in: following,
        },
    })
        .populate(
            'user',
            '-posts -favorites -reposts -email -createdAt -__v -_id',
        )
        .sort({ createdAt: -1 });

    res.status(200).json(posts);
});

router.get('/user-feed/:username', authenticate, async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username });

    const posts = await Post.find({ user })
        .populate(
            'user',
            '-posts -favorites -reposts -email -createdAt -__v -_id',
        )
        .sort({ createdAt: -1 });

    res.status(200).json(posts);
});

router.get('/search/:searchParams', authenticate, async (req, res) => {
    const { searchParams } = req.params;
    const trimmedSearchParams = searchParams.trim();

    const users = await User.find({
        username: { $regex: trimmedSearchParams, $options: 'i' },
    });

    const posts = await Post.find({
        $or: [
            { title: { $regex: trimmedSearchParams, $options: 'i' } },
            { postBody: { $regex: trimmedSearchParams, $options: 'i' } },
            { user: { $in: users } },
        ],
    })
        .populate(
            'user',
            '-posts -favorites -reposts -email -createdAt -__v -_id',
        )
        .sort({ createdAt: -1 });

    res.status(200).json(posts);
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

router.delete('/repost', authenticate, async (req, res) => {});

router.post('/favorite', authenticate, async (req, res) => {
    try {
        const { postId } = req.body;

        const post = await Post.findById(postId);

        if (!post) {
            res.status(404).statusMessage = 'No post could be found';
            return res.send();
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404).statusMessage = 'No user could be found';
            return res.send();
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

router.delete('/favorite', authenticate, async (req, res, next) => {});

router.get('/', authenticate, async (req, res) => {});

module.exports = router;
