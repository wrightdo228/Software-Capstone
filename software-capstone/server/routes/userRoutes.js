const mongoose = require('mongoose');
const express = require('express');
const { validationResult } = require('express-validator');
const { promisify } = require('es6-promisify');
const registerValidator = require('../middleware/registerValidator');

const User = mongoose.model('User');

const router = express.Router();

router.post('/', registerValidator, async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const user = new User({
        email: req.body.email,
        username: req.body.username,
    });

    const register = promisify(User.register.bind(User));

    try {
        await register(user, req.body.password);
    } catch (error) {
        res.status(500).send();
    }

    res.status(200).json(user).send();
});

module.exports = router;
