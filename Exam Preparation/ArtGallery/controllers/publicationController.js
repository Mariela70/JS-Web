const { createPublication, getById, deleteById, update, getByUser } = require('../services/publicationService');
const { parseError } = require('../util/parser');

const publicationController = require('express').Router();

publicationController.get('/create', (req, res) => {
    res.render('create', {
        title: 'Create Publication'
    })
});
publicationController.get('/:id/details', async (req, res) => {
    const publication = await getById(req.params.id);
    if (publication.author == req.user._id) {
        publication.isAuthor = true;
    }else if(publication.users.map(b => b.toString()).includes(req.user._id.toString())) {
        publication.isShared = true;
    }
    res.render('details', {
        title: publication.title,
        publication
    })

})
publicationController.get('/:id/edit', async (req, res) => {
    const publication = await getById(req.params.id);

    if (publication.author != req.user._id) {
        return res.redirect('/auth/login');
    }
    res.render('edit', {
        title: 'Edit Publication',
        publication
    });
})
publicationController.post('/:id/edit', async (req, res) => {
    const publication = await getById(req.params.id);
    if (publication.author != req.user._id) {
        return res.redirect('/auth/login');
    }
    const edited = {
        title: req.body.title,
        painting: req.body.painting,
        art: req.body.art,
        authenticity: req.body.authenticity

    };

    try {
        if (Object.values(edited).some(v => !v)) {
            throw new Error('All fields are required');
        }
        await update(req.params.id, edited);
        res.redirect(`/publication/${req.params.id}/details`);

    } catch (error) {
        res.render('edit', {
            title: 'Edit Hotel',
            publication: Object.assign(edited, { _id: req.params.id }),
            errors: parseError(error)
        });

    }
})
publicationController.get('/:id/delete', async (req, res) => {
    const publication = await getById(req.params.id);

    if (publication.author != req.user._id) {
        return res.redirect('/auth/login');
    }
    
    await deleteById(req.params.id);
    res.redirect('/');
})
publicationController.get('/:id/shared', async (req, res) => {
    const publication = await getById(req.params.id);
try {

    if (publication.author == req.user._id) {
        publication.isAuthor = true;
        throw new Error('Cannot publicate!')
    }
    
    await getByUser(req.params.id, req.user._id);
    res.redirect(`/publication/${req.params.id}/details`);
}catch(error) {
    res.render('details', {
        title: 'Details',
        publication,
        errors: parseError(error)
    })
}
})

publicationController.post('/create', async(req, res) => {
    const publication = {
        title: req.body.title,
        painting: req.body.painting,
        art: req.body.art,
        authenticity: req.body.authenticity,
        author: req.user._id

    }

try{
    await createPublication(publication);
    res.redirect('/catalog')

}catch(error) {

    res.render('create', {
        title: 'Create Publication',
        errors: parseError(error),
        body: publication
    })
}

})


module.exports = publicationController;