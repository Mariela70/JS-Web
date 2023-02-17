const Publication = require('../models/Publication');


async function getAll() {
    return Publication.find({}).lean();
}
async function getById(id) {
    return Publication.findById(id).lean();
}

async function createPublication(publication) {
    return Publication.create(publication);
}
async function update(id, publication) {
    const existing = await Publication.findById(id);

    existing.title = publication.title;
    existing.painting = publication.painting;
    existing.art = publication.art;
    existing.authenticity = publication.authenticity;

    await existing.save();
}
async function deleteById(id) {
    return Publication.findByIdAndDelete(id);
}
async function getByUser(publicationId, userId) {
    const publication = await Publication.findById(publicationId);
    if(publication.users.includes(userId)) {
        throw new Error('You already shared this publication');
    }
    publication.users.push(userId);
    await publication.save();
}
async function getProfileUser(userId) {
    return (await Publication.find({users: userId}).lean());
}

module.exports = {
    getAll,
    getById,
    createPublication,
    update,
    deleteById,
    getByUser,
    getProfileUser
}