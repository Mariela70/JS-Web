const { hasUser, isGuest } = require('../middlewares/guards');
const { register, login } = require('../services/userService');
const { parseError } = require('../util/parser');
const authController = require('express').Router();

authController.get('/register', isGuest(), (req, res) => {
    res.render('register', {
        title: 'Register Page'
    });
});

authController.post('/register', isGuest(), async (req, res) => {
    try {
        if (req.body.password == '') {
            throw new Error('Password is required');
        } else if (req.body.password != req.body.repass) {
            throw new Error('Password don\'t match');
        }

        const user = await register(req.body.firstName, req.body.lastName, req.body.email, req.body.password);

        req.session.user = user;
        res.redirect('/');
    } catch (error) {
        const errors = parseError(error);
        res.render('register', {
            title: 'Register Page',
            errors,
            body: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email
            }
        });

    }
});

authController.get('/login', isGuest(), (req, res) => {
    res.render('login', {
        title: 'Login Page'
    });
});
authController.post('/login', isGuest(), async (req, res) => {
    try {
        const user = await login(req.body.email, req.body.password);

        req.session.user = user;
        res.redirect('/');
    } catch (error) {
        const errors = parseError(error);
        res.render('login', {
            title: 'Login Page',
            errors,
            body: {
                email: req.body.email
            }
        });

    }
});
authController.get('/logout', hasUser(), (req, res) => {
    delete req.session.user;
    res.redirect('/');
})
module.exports = authController;