function hasUser() {
    return (req, res, next) => {
        if(req.session.user) {
            next();
        }else {
            res.redirect('/auth/login');
        }
    };
}
function isGuest() {
    return (req, res, next) => {
        if(req.session.user) {
            res.redirect('/');
        }else {
            next();
        }
    };
}
module.exports = {
    hasUser,
    isGuest
};