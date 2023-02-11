const {Schema, model, Types: {ObjectId}} = require('mongoose');

const userSchema = new Schema({
    email: {type: String, required: true, unique: true, minlength: [3, 'username must be at least 3 characters long']},
    hashedPassword: {type: String, required: true},
    gender: {type: String, required: true},
    trips: {type: [ObjectId], ref: 'Trip', default: []}
});
userSchema.index({email: 1}, {
    collation: {
        locale: 'en',
        strength: 2
    }
});

const User = model('User', userSchema);
module.exports = User;