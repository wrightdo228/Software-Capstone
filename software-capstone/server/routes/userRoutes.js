const mongoose = require('mongoose');
const express = require('express');

const upload = require('../services/fileUpload');
const authenticate = require('../middleware/authenticate');

const User = mongoose.model('User');
const router = express.Router();

const singleImageUpload = upload.single('image');

const getReducedUser = (user, req) => ({
    id: user._id,
    username: user.username,
    followerCount: user.followers.length,
    followingCount: user.following.length,
    favoriteCount: user.favorites.length,
    collectionCount: user.postCollections.length,
    avatar: user.avatar,
    ownAccount: user._id.equals(req.user._id),
    following: user.followers.includes(req.user._id),
});

router.get('/', authenticate, async (req, res) => {
    const user = await User.findById(req.user._id);

    const reducedUser = getReducedUser(user, req);

    return res.json(reducedUser);
});

router.post('/follow/:userId', authenticate, async (req, res) => {
    const user = await User.findById(req.params.userId);

    if (user._id.equals(req.user._id)) {
        res.status(400).statusMessage = 'Cannot follow yourself';
        return res.send();
    }

    const follower = await User.findById(req.user._id);

    if (user.followers.includes(follower._id)) {
        res.status(400).statusMessage = 'Already following this user';
        return res.send();
    }

    user.followers.push(follower);
    const savedUser = await user.save();

    follower.following.push(savedUser);
    await follower.save();

    return res.status(200).send();
});

router.post('/upload-avatar', authenticate, async (req, res) => {
    try {
        singleImageUpload(req, res, async (error) => {
            if (error) {
                console.log(error);
                return res.status(400).send();
            }

            await User.findByIdAndUpdate(
                { _id: req.user._id },
                {
                    $set: {
                        avatar: req.file.location,
                    },
                },
            );

            return res.status(200).send();
        });
    } catch {
        return res.status(500).send();
    }
});

router.delete('/follow/:userId', authenticate, async (req, res) => {
    try {
        const follower = await User.findById(req.user._id);

        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            {
                $pull: { followers: follower._id },
            },
        );

        await User.findByIdAndUpdate(
            { _id: req.user._id },
            {
                $pull: { following: user._id },
            },
        );
    } catch {
        res.status(500).statusMessage = 'Issue while updating';
        return res.send();
    }

    return res.status(200).send();
});

router.get('/following/:username', authenticate, async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.params.username,
        })
            .select('following username')
            .populate('following');

        return res.json(user);
    } catch {
        res.status(500);
        return res.send();
    }
});

router.get('/:username', authenticate, async (req, res) => {
    const user = await User.findOne({ username: req.params.username });

    const reducedUser = getReducedUser(user, req);

    return res.json(reducedUser);
});

module.exports = router;
