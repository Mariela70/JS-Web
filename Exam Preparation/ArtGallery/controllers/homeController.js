const { getAll } = require('../services/publicationService');

const homeController = require('express').Router();

homeController.get('/', (req, res) => {
    res.render('home', {
        title: 'Home Page',
        user: req.user
    });
});

homeController.get('/catalog', async(req, res) => {
    const publications = await getAll();
    res.render('catalog', {
        title: 'Catalog Page',
        publications 
    })
})

module.exports = homeController;