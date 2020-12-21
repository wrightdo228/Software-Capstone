const mongoose = require('mongoose');
const express = require('express');
const { validationResult } = require('express-validator');
const { promisify } = require('es6-promisify');
const registerValidator = require('../middleware/registerValidator');
const authController = require('../controllers/authController');

const User = mongoose.model('User');

const router = express.Router();

router.post(
    '/',
    registerValidator,
    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = new User({
            email: req.body.email,
            username: req.body.username,
            normalizedUsername: req.body.username,
        });

        const register = promisify(User.register.bind(User));

        try {
            await register(user, req.body.password);
            next();
        } catch (error) {
            console.log(error);
            return res.status(500).send();
        }
    },
    authController.login,
    (req, res) => {
        res.status(200).send();
    },
);

module.exports = router;
