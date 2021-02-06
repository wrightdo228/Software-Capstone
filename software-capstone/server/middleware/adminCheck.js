module.exports = (req, res, next) => {
    const { role } = req.user;

    if (['admin', 'super-admin'].includes(role)) {
        next();
    } else {
        return res.status(401).send();
    }
};
