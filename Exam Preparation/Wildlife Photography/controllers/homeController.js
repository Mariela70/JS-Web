const { hasUser } = require('../middlewares/guards');
const { getAllPosts, getPostById, getPostByAuthor } = require('../services/postService');
const { postViewModel } = require('../util/parser');

const homeController = require('express').Router();

homeController.get('/', (req, res) => {
    res.render('home', {
        title: 'Home Page',

    });
});
homeController.get('/catalog', async (req, res) => {
    const posts = (await getAllPosts()).map(postViewModel);
    res.render('catalog', {
        title: 'Catalog',
        posts
    })
})
homeController.get('/catalog/:id', async (req, res) => {
    const id = req.params.id;
    const post = postViewModel(await getPostById(id));
    if (req.session.user) {
        post.hasUser = true;
        if (req.session.user._id == post.author._id) {
            post.isAuthor = true;
        }else {
            post.hasVoted = post.votes.find(v => v._id == req.session.user._id) != undefined;
        }
    }
    res.render('details', {
        title: post.title,
        post
    })
})

homeController.get('/profile', hasUser(), async(req, res) => {
    const posts = (await getPostByAuthor(req.session.user._id)).map(postViewModel);
    res.render('profile', {
        title: 'Profile',
        posts
    })
})

module.exports = homeController;