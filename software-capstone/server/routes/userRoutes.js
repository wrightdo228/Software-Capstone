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
    favorites: user.favorites,
    collectionCount: user.postCollections.length,
    avatar: user.avatar,
    ownAccount: user._id.equals(req.user._id),
    following: user.followers.includes(req.user._id),
    role: user.role,
    status: user.status,
    postCollections: user.postCollections,
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
            username: { $regex: new RegExp(req.params.username.trim(), 'i') },
        })
            .select('following username')
            .populate('following');

        const following = user.following
            .filter((follow) => follow.status === 'active')
            .map((follow) => ({
                username: follow.username,
                following: follow.followers.includes(req.user._id),
                ownAccount: follow._id.equals(req.user._id),
                id: follow._id,
                followerCount: follow.followers.length,
                followingCount: follow.following.length,
            }));

        return res.json(following);
    } catch {
        res.status(500);
        return res.send();
    }
});

router.get('/followers/:username', authenticate, async (req, res) => {
    try {
        const user = await User.findOne({
            username: { $regex: new RegExp(req.params.username.trim(), 'i') },
        })
            .select('followers username')
            .populate('followers');

        const followers = user.followers
            .filter((follow) => follow.status === 'active')
            .map((follow) => ({
                username: follow.username,
                following: follow.followers.includes(req.user._id),
                ownAccount: follow._id.equals(req.user._id),
                id: follow._id,
                followerCount: follow.followers.length,
                followingCount: follow.following.length,
            }));

        return res.json(followers);
    } catch {
        res.status(500);
        return res.send();
    }
});

router.get('/search/:username', authenticate, async (req, res) => {
    try {
        const users = await User.find({
            username: { $regex: req.params.username.trim(), $options: 'i' },
            _id: {
                $ne: req.user._id,
            },
        });

        const reducedUsers = users.map((user) => ({
            _id: user._id,
            username: user.username,
            avatar: user.avatar,
            status: user.status,
            role: user.role,
        }));

        return res.json(reducedUsers);
    } catch {
        return res.status(500).send();
    }
});

router.put('/ban/:userId', authenticate, async (req, res) => {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(userId, {
        status: 'banned',
    });

    if (user) {
        return res.status(200).send();
    }

    return res.status(400);
});

router.put('/unban/:userId', authenticate, async (req, res) => {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(userId, {
        status: 'active',
    });

    if (user) {
        return res.status(200).send();
    }

    return res.status(400);
});

router.put('/make-admin/:userId', authenticate, async (req, res) => {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(userId, {
        role: 'admin',
    });

    if (user) {
        return res.status(200).send();
    }

    return res.status(400);
});

router.put('/make-user/:userId', authenticate, async (req, res) => {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(userId, {
        role: 'user',
    });

    if (user) {
        return res.status(200).send();
    }

    return res.status(400);
});

// router.put('/make-super-admin/:userId', authenticate, async (req, res) => {
//     const { userId } = req.params;

//     const user = await User.findByIdAndUpdate(userId, {
//         role: 'super-admin',
//     });

//     if (user) {
//         return res.status(200).send();
//     }

//     return res.status(400);
// });

router.get('/admin-info', authenticate, async (req, res) => {
    const user = User.findById(req.user._Id);

    return res.json({
        isAdmin: user.role === 'admin',
        isSuperAdmin: user.role === 'super-admin',
    });
});

router.get('/:username', authenticate, async (req, res) => {
    try {
        const user = await User.findOne({
            username: { $regex: new RegExp(req.params.username.trim(), 'i') },
        });

        if (!user) {
            return res.status(404).send();
        }

        if (user.status === 'banned') {
            return res.status(403).send();
        }

        const reducedUser = getReducedUser(user, req);

        return res.json(reducedUser);
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

module.exports = router;
