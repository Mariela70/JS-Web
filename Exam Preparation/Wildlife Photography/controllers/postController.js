const { hasUser } = require('../middlewares/guards');
const { createPost, getPostById, updatePost, deletePost, vote } = require('../services/postService');
const { parseError, postViewModel } = require('../util/parser');

const postController = require('express').Router();

postController.get('/create', hasUser(), (req, res) => {
    res.render('create', {
        title: 'Create Post'
    })

}
)

postController.post('/create', hasUser(), async (req, res) => {
    const userId = req.session.user._id;

    const post = {
        title: req.body.title,
        keyword: req.body.keyword,
        location: req.body.location,
        date: req.body.date,
        image: req.body.image,
        description: req.body.description,
        author: userId
    };
    try {
        await createPost(post);
        res.redirect('/catalog');
    } catch (err) {
        console.error(err);
        const errors = parseError(err);
        res.render('create', {
            title: 'Create Post',
            errors,
            body: post
        })
    }
})
postController.get('/edit/:id', hasUser(), async (req, res) => {
    const id = req.params.id;
    const post = postViewModel(await getPostById(id));

    if (req.session.user._id != post.author._id) {
        return res.redirect('/login')
    }
    res.render('edit', {
        title: 'Edit Post',
        post
    })
})
postController.post('/edit/:id', hasUser(), async (req, res) => {
    const id = req.params.id;
    const existing = postViewModel(await getPostById(id));

    if (req.session.user._id != existing.author._id) {
        return res.redirect('/login')
    }


    const post = {
        title: req.body.title,
        keyword: req.body.keyword,
        location: req.body.location,
        date: req.body.date,
        image: req.body.image,
        description: req.body.description,
    };
    try {
        await updatePost(id, post);
        res.redirect('/catalog/' + id);
    } catch (err){
        console.error(err);
        const errors = parseError(err);
        post._is = id;
        res.render('edit', {
            title: 'Edit Post',
            post,
            errors
        })
    }
});
postController.get('/delete/:id', hasUser(), async(req, res) => {
    const id = req.params.id;
    const existing = postViewModel(await getPostById(id));

    if (req.session.user._id != existing.author._id) {
        return res.redirect('/login')
    }
    try {
        await deletePost(id);
        res.redirect('/catalog/');
    } catch(err){
        console.error(err);
        const errors = parseError(err);
        
        res.render('details', {
            title: existing.title,
            errors
        })
    }

})
postController.get('/vote/:id/:type', hasUser(), async(req, rea) => {
    const id = req.params.id;
    const value = req.params.type == 'upvote' ? 1 : -1;

    try {
        await vote(id, req.session.user._id, value);
        res.redirect('/catalog/' + id);
    } catch(err){
        console.error(err);
        const errors = parseError(err);
        
        res.render('details', {
            title: 'Post Details',
            errors
        })
    }
})


module.exports = postController;