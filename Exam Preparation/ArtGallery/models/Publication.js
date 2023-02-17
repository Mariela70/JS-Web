const {Schema, model, Types} = require('mongoose');
const URL_PATTERN = /https?:\/\/./i;
const publicationSchema = new Schema({
    title: {type: String, minlength: [6, 'Title title must be at least 6 characters long']},
    painting : {type: String, maxlength: [15, 'Painting technique must be a maximum 15 characters long']},
    art: {
        type: String, validate: {
            validator: (value) => URL_PATTERN.test(value),
            message: 'Invalid URL'
        }
    },
    authenticity : {type: String, required: true},
    author: {type: Types.ObjectId, ref: 'User', required: true},
    users: {type: [Types.ObjectId], ref: 'User', default: [] }
});

const Publication = model('Publication', publicationSchema);
module.exports = Publication;