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
    '/add-contributor/:collectionId/:',
    authenticate,
    async (req, res) => {},
);

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

router.get('/:collectionId', authenticate, async (req, res) => {
    try {
        console.log('here');
        const collection = await PostCollection.findById(
            req.params.collectionId,
        )
            .populate('posts')
            .populate('creator', 'username avatar');

        const responseObject = {
            collection,
            isCreator: collection.creator.equals(req.user._id),
            isContributor: collection.contributors.includes(req.user._id),
        };
        console.log(responseObject);
        return res.json(responseObject);
    } catch {
        return res.status(500).send();
    }
});

module.exports = router;
