const mongoose = require('mongoose');
const express = require('express');
const { validationResult } = require('express-validator');
const promisify = require('promisify');
const registerValidator = require('../middleware/registerValidator');

const User = mongoose.model('User');

const router = express.Router();

router.post('/', registerValidator, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const user = new User({
        email: req.body.email,
        username: req.body.username,
    });

    const register = promisify(User.register, User);
    await register(user, req.body.password);

    res.status(200).json(user).send();
});

module.exports = router;
