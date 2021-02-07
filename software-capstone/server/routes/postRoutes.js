const express = require('express');
const mongoose = require('mongoose');
const authenticate = require('../middleware/authenticate');
const adminCheck = require('../middleware/adminCheck');

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

router.delete('/:postId', authenticate, async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId).populate('user');

        if (!post) {
            return res.status(404).send();
        }

        const deleteAllowed =
            ['admin', 'super-admin'].includes(req.user.role) ||
            post._id.equals(req.user._id);

        if (!deleteAllowed) {
            return res.statusCode(401).send();
        }

        const favorites = await Favorite.find({ post: postId });
        const reposts = await Repost.find({ post: postId });

        await User.updateMany(
            {
                favorites: {
                    $in: favorites,
                },
            },
            {
                $pull: {
                    favorites: { $in: favorites },
                },
            },
        );

        await User.updateMany(
            {
                reposts: {
                    $in: reposts,
                },
            },
            {
                $pull: {
                    reposts: { $in: reposts },
                },
            },
        );

        await Repost.deleteMany({ post: postId });
        await Favorite.deleteMany({ post: postId });
        await User.findOneAndUpdate(
            { _id: post.user._id },
            {
                $pull: { posts: postId },
            },
        );
        await Post.findOneAndDelete({ _id: postId });
        return res.status(200).send();
    } catch {
        return res.status(500).send();
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
        .populate('favorites')
        .populate(
            'user',
            '-posts -reposts -email -createdAt -__v -followers -following',
        )
        .sort({ createdAt: -1 });

    // const mappedPosts = posts.map((post) => ({
    //     ...post,
    //     favorited:
    //         post.favorites.filter((favorite) =>
    //             favorite.user.equals(req.user._id),
    //         ).length > 0,
    // }));

    res.status(200).json(posts);
});

router.get('/user-feed/:username', authenticate, async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username });

    const posts = await Post.find({ user })
        .populate(
            'user',
            '-posts -favorites -reposts -email -createdAt -__v -_id -followers -following',
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
            '-posts -favorites -reposts -email -createdAt -__v -_id -followers -following',
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

router.get('/favorites/:username', authenticate, async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username });

        const favorites = await Favorite.find({ user })
            .populate({
                path: 'post',
                populate: {
                    path: 'user',
                    model: 'User',
                    select:
                        '-posts -favorites -reposts -email -createdAt -__v -_id -followers -following',
                },
            })
            .sort({ createdAt: -1 });

        const reducedFavorites = favorites.map((favorite) => favorite.post);

        res.status(200).json(reducedFavorites);
    } catch {
        res.status(500).send();
    }
});

router.post('/comment', authenticate, async (req, res) => {
    try {
        const { postId, comment } = req.body;

        const newComment = { user: req.user._id, comment };

        await Post.findOneAndUpdate(
            { _id: postId },
            { $push: { comments: newComment } },
        );

        res.status(200).send();
    } catch {
        res.status(500).send();
    }
});

router.put('/feature/:postId', authenticate, adminCheck, async (req, res) => {
    const post = await Post.findByIdAndUpdate(req.params.postId, {
        featured: true,
        featuedOn: Date.now(),
    });

    if (post) {
        return res.status(200).send();
    }

    return res.status(404).send();
});

router.put(
    '/remove-feature/:postId',
    authenticate,
    adminCheck,
    async (req, res) => {
        const post = await Post.findByIdAndUpdate(req.params.postId, {
            featured: false,
            featuedOn: null,
        });

        if (post) {
            return res.status(200).send();
        }

        return res.status(404).send();
    },
);

router.get('/:postId', authenticate, async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId)
            .populate(
                'user',
                '-posts -favorites -reposts -email -createdAt -__v -_id -followers -following',
            )
            .populate('comments.user', 'username');

        if (!post) {
            return res.status(404).send();
        }

        res.status(200).json(post);
    } catch {
        res.status(400).send();
    }
});

router.delete('/favorite', authenticate, async (req, res, next) => {});

router.get('/', authenticate, async (req, res) => {});

module.exports = router;
