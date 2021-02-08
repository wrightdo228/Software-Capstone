const mongoose = require('mongoose');
const express = require('express');
const authenticate = require('../middleware/authenticate');
const upload = require('../services/fileUpload');

const User = mongoose.model('User');
const PostCollection = mongoose.model('PostCollection');
const Post = mongoose.model('Post');

const router = express.Router();

const singleImageUpload = upload.single('image');

router.get('/', authenticate, async (req, res) => {
    try {
        const userId = req.user._id;

        const collections = await PostCollection.find({
            $or: [{ creator: userId }, { contributors: userId }],
        });

        return res.status(200).json(collections);
    } catch {
        res.status(500).send();
    }
});

router.get(
    '/specific-collection/:collectionId',
    authenticate,
    async (req, res) => {
        try {
            const collection = await PostCollection.findById(
                req.params.collectionId,
            )
                .populate({
                    path: 'posts',
                    populate: {
                        path: 'user',
                        model: 'User',
                    },
                })
                .populate('creator');

            return res.json(collection);
        } catch {
            return res.status(500).send();
        }
    },
);

router.post('/', authenticate, async (req, res) => {
    try {
        singleImageUpload(req, res, async (error) => {
            if (error) {
                console.log(error);
                return res.status(400).send();
            }

            const user = await User.findById(req.user._id);

            const postCollection = new PostCollection({
                creator: user,
                title: req.body.title,
                description: req.body.description,
                image: req.file.location,
                isPrivate: req.body.private,
            });

            const savedPostCollection = await postCollection.save();

            await User.findOneAndUpdate(
                { _id: user._id },
                { $push: { postCollections: savedPostCollection } },
            );

            return res.status(201).json(savedPostCollection);
        });
    } catch {
        return res.status(500).send();
    }
});

router.put(
    '/add-contributor/:collectionId/:userId',
    authenticate,
    async (req, res) => {
        try {
            const { collectionId, userId } = req.params;

            const collection = await PostCollection.findById(
                collectionId,
            ).populate('creator');

            if (!collection) {
                return res.status(404).send();
            }

            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).send();
            }

            const addAllowed = collection.creator._id.equals(req.user._id);

            if (!addAllowed) {
                return res.status(401).send();
            }

            const updateCollection = await PostCollection.findOneAndUpdate(
                { _id: collection._id, contributors: { $ne: user } },
                {
                    $push: {
                        contributors: user,
                    },
                },
            );

            if (!updateCollection) {
                return res.status(400).send();
            }

            return res.status(200).send();
        } catch {
            return res.status(500).send();
        }
    },
);

router.put(
    '/remove-contributor/:collectionId/:userId',
    authenticate,
    async (req, res) => {
        try {
            const { collectionId, userId } = req.params;

            const collection = await PostCollection.findById(
                collectionId,
            ).populate('creator');

            if (!collection) {
                return res.status(404).send();
            }

            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).send();
            }

            const removeAllowed = collection.creator._id.equals(req.user._id);

            if (!removeAllowed) {
                return res.status(401).send();
            }

            const updateCollection = await PostCollection.findOneAndUpdate(
                { _id: collection._id, contributors: user._id },
                {
                    $pull: {
                        contributors: user._id,
                    },
                },
            );

            if (!updateCollection) {
                return res.status(400).send();
            }

            return res.status(200).send();
        } catch {
            return res.status(500).send();
        }
    },
);

router.put('/add-favorite/:collectionId', authenticate, async (req, res) => {
    try {
        const { collectionId } = req.params;

        const collection = await PostCollection.findById(collectionId).populate(
            'creator',
        );

        if (!collection) {
            return res.status(404).send();
        }

        const user = await User.findOneAndUpdate(
            {
                _id: req.user._id,
                postCollections: { $ne: collection._id },
            },
            {
                $push: {
                    postCollections: collection._id,
                },
            },
        );

        if (!user) {
            return res.status(400).send();
        }

        return res.status(200).send();
    } catch {
        return res.status(500).send();
    }
});

router.put('/remove-favorite/:collectionId', authenticate, async (req, res) => {
    try {
        const { collectionId } = req.params;

        const collection = await PostCollection.findById(collectionId).populate(
            'creator',
        );

        if (!collection) {
            return res.status(404).send();
        }

        const user = await User.findOneAndUpdate(
            {
                _id: req.user._id,
                postCollections: collection._id,
            },
            {
                $pull: {
                    postCollections: collection._id,
                },
            },
        );

        if (!user) {
            return res.status(400).send();
        }

        return res.status(200).send();
    } catch {
        return res.status(500).send();
    }
});

router.get('/featured-collections', authenticate, async (req, res) => {
    let collections = await PostCollection.find({
        featured: true,
    })
        .populate('creator')
        .sort({
            featuredOn: -1,
        });

    collections = collections.filter(
        (collection) => collection.creator.status === 'active',
    );

    return res.json(collections);
});

router.get('/contributors/:collectionId', authenticate, async (req, res) => {
    const collection = await PostCollection.findById(
        req.params.collectionId,
    ).populate('contributors');

    return res.json(collection.contributors);
});

router.put('/feature/:collectionId', authenticate, async (req, res) => {
    const isAdmin = ['admin', 'super-admin'].includes(req.user.role);

    if (!isAdmin) {
        return res.status(401).send();
    }

    const collection = await PostCollection.findOneAndUpdate(
        { _id: req.params.collectionId },
        {
            featured: true,
            featuredOn: Date.now(),
        },
    );

    if (collection) {
        return res.status(200).send();
    }

    return res.status(400).send();
});

router.put('/unfeature/:collectionId', authenticate, async (req, res) => {
    const isAdmin = ['admin', 'super-admin'].includes(req.user.role);

    if (!isAdmin) {
        return res.status(401).send();
    }

    const collection = await PostCollection.findOneAndUpdate(
        { _id: req.params.collectionId },
        {
            featured: false,
            featuredOn: null,
        },
    );

    if (collection) {
        return res.status(200).send();
    }

    return res.status(400).send();
});

router.get('/search/:title', authenticate, async (req, res) => {
    try {
        const collections = await PostCollection.find({
            username: { $regex: req.params.title.trim(), $options: 'i' },
        });

        return res.json(collections);
    } catch {
        res.status(500).send();
    }
});

router.put('/:collectionId/:postId', authenticate, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).send();
        }

        const userId = req.user._id;

        const updatedCollection = await PostCollection.findOneAndUpdate(
            {
                $and: [
                    {
                        _id: req.params.collectionId,
                    },
                    { $or: [{ creator: userId }, { contributors: userId }] },
                    { posts: { $ne: post._id } },
                ],
            },
            { $push: { posts: post } },
        );

        if (!updatedCollection) {
            return res.status(401).send();
        }

        return res.status(201).send();
    } catch {
        return res.status(500).send();
    }
});

router.put(
    '/remove-from-collection/:collectionId/:postId',
    authenticate,
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.postId);

            if (!post) {
                return res.status(404).send();
            }

            const userId = req.user._id;

            const updatedCollection = await PostCollection.findOneAndUpdate(
                {
                    $and: [
                        {
                            _id: req.params.collectionId,
                        },
                        {
                            $or: [
                                { creator: userId },
                                { contributors: userId },
                            ],
                        },
                        { posts: post._id },
                    ],
                },
                { $pull: { posts: post._id } },
            );

            if (!updatedCollection) {
                return res.status(401).send();
            }

            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send();
        }
    },
);

router.get('/user-collections/:username', authenticate, async (req, res) => {
    try {
        const user = await User.findOne({
            username: { $regex: new RegExp(req.params.username, 'i') },
        }).populate({
            path: 'postCollections',
            populate: { path: 'creator', model: 'User' },
            options: {
                sort: { createdAt: -1 },
            },
        });

        user.postCollections = user.postCollections.filter(
            (collection) => collection.creator.status === 'active',
        );

        return res.json(user);
    } catch {
        return res.status(500).send();
    }
});

router.get('/:collectionId', authenticate, async (req, res) => {
    try {
        const collection = await PostCollection.findById(
            req.params.collectionId,
        )
            .populate({
                path: 'posts',
                populate: {
                    path: 'user',
                    model: 'User',
                },
            })
            .populate('creator', 'username avatar');

        if (!collection) {
            return res.status(404).send();
        }

        if (collection.creator.status === 'banned') {
            return res.status(403).send();
        }

        const responseObject = {
            collection,
            isCreator: collection.creator.equals(req.user._id),
            isContributor: collection.contributors.includes(req.user._id),
        };

        return res.json(responseObject);
    } catch {
        return res.status(500).send();
    }
});

router.delete('/:collectionId', authenticate, async (req, res) => {
    const { collectionId } = req.params;

    try {
        const collection = await PostCollection.findById(collectionId).populate(
            'creator',
        );

        if (!collection) {
            return res.status(404).send();
        }

        const deletedAllowed =
            collection.creator._id.equals(req.user._id) ||
            ['admin', 'super-admin'].includes(req.user.role);

        if (!deletedAllowed) {
            return res.status(401).send();
        }

        await User.updateMany(
            { postCollections: collectionId },
            {
                $pull: {
                    postCollections: collectionId,
                },
            },
        );

        await PostCollection.findOneAndDelete({ _id: collectionId });

        return res.status(200).send();
    } catch {
        return res.status(500).send();
    }
});

module.exports = router;
