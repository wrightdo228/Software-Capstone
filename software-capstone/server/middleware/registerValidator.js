const { body } = require('express-validator');

const registerValidator = [
    body('username', 'Username is required').notEmpty(),
    body('email', 'Email is required').isEmail().normalizeEmail({
        gmail_remove_dots: false,
        gmail_remove_subaddress: false,
    }),
    body('password', 'Password is required').notEmpty(),
    body('confirmPassword', 'Password confirmation required').notEmpty(),
    body('confirmPassword', 'Passwords do not match').custom(
        (value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords don't match");
            } else {
                return value;
            }
        },
    ),
];

module.exports = registerValidator;
