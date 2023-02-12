function hasUser() {
    return (req, res, next) => {
        if (req.session.user) {
            next();
        } else {
            res.redirect('/auth/login');
        }
    };
}
function isGuest() {
    return (req, res, next) => {
        if (req.session.user) {
            res.redirect('/');
        } else {
            next();
        }
    };
}
function isOwner() {
    return function (req, res, next) {
        const userId = req.session.user?._id;
        if (res.locals.trip.owner == userId) {
            next();
        } else {
            res.redirect('/auth/login');
        }
    }
}
module.exports = {
    hasUser,
    isGuest,
    isOwner
};