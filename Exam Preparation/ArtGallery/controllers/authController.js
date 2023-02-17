const { body, validationResult } = require('express-validator');
const {register, login} = require('../services/userService');
const { parseError } = require('../util/parser');
const authController = require('express').Router();

authController.get('/register', (req, res) =>{
    res.render('register', {
        title: 'Register Page'
    });
});

authController.post('/register',
body('username')
.isLength({min: 4}).withMessage('Username mustt be at least 4 characters long'),
body('password')
.isLength({min: 3}).withMessage('Password mustt be at least 3 characters long'),
body('address')
.isLength({max: 20}).withMessage('Adress must be a maximum 20 characters long'),
 async (req, res) =>{
    try{
        const {errors} = validationResult(req);
        if(errors.length > 0) {
            throw errors;
        }
        if(req.body.password != req.body.repass) {
            throw new Error('Password don\'t match');
        }

        const token = await register(req.body.username, req.body.address, req.body.password);
        
        res.cookie('token', token);
        res.redirect('/');
    }catch(error) {
        const errors = parseError(error);
        res.render('register', {
            title: 'Register Page',
            errors,
            body: {
                username: req.body.username,
                address: req.body.address
            }
        });

    }
});

authController.get('/login', (req, res) =>{
    res.render('login', {
        title: 'Login Page'
    });
});
authController.post('/login', async(req, res) =>{
   try{
    const token = await login(req.body.username, req.body.password);

    res.cookie('token', token);
    res.redirect('/');
   }catch (error){
    const errors = parseError(error);
    res.render('login', {
        title: 'Login Page',
        errors,
        body: {
            username: req.body.username
        }
    });

   }
});
authController.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
})
module.exports = authController;