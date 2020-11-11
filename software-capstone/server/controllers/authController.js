const passport = require('passport');

exports.login = passport.authenticate('local');

exports.logout = (req, res) => {
    console.log('authenticated', req.isAuthenticated());
    console.log(req.user);
    req.logout();
    res.status(200).send();
};
