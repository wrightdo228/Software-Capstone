const mongoose = require('mongoose');
const express = require('express');
const authenticate = require('../middleware/authenticate');

const User = mongoose.model('User');

const router = express.Router();

const getReducedUser = (user, req) => ({
    id: user._id,
    username: user.username,
    followerCount: user.followers.length,
    followingCount: user.following.length,
    favoriteCount: user.favorites.length,
    collectionCount: 5,
    ownAccount: user._id.equals(req.user._id),
    following: user.followers.includes(req.user._id),
});

router.get('/', authenticate, async (req, res) => {
    const user = await User.findById(req.user._id);

    const reducedUser = getReducedUser(user, req);

    res.status(200).json(reducedUser).send();
});

router.get('/:username', authenticate, async (req, res) => {
    const user = await User.findOne({ username: req.params.username });

    const reducedUser = getReducedUser(user, req);

    res.status(200).json(reducedUser).send();
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

    res.status(200).send();
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

    res.status(200).send();
});

module.exports = router;
