const express = require('express');
const { findOneAndUpdate } = require('../../models/Post');

const router = express.Router();

router.put('/feature-collection/:collectionId', (req, res) => {
    const { collectionId } = req.params;

    findOneAndUpdate({ _id: collectionId });
});

router.get('/logout', (req, res) => {});

module.exports = router;
