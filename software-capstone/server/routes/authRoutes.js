const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', authController.login, (req, res, next) => {
    res.status(200).send();
});
router.get('/logout', authController.logout);

module.exports = router;
