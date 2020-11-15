const mongoose = require('mongoose');
const express = require('express');
const authenticate = require('../middleware/authenticate');

const User = mongoose.model('User');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
    const user = await User.findById(req.user._id);
    res.status(200).json(user).send();
});

module.exports = router;
