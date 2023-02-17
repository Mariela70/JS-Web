const { hasUser } = require('../middlewares/guards');
const {  getProfileUser } = require('../services/publicationService');

const profileController = require('express').Router();

profileController.get('/', hasUser(), async(req, res) => {
    const users = await getProfileUser(req.user._id);
    res.render('profile', {
        title: 'Profile Page',
        user: Object.assign({users}, req.user)
    });
});
module.exports = profileController;