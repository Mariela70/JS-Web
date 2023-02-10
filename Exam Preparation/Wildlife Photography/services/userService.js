const bcrypt = require('bcrypt');
const User = require('../models/User');

async function register(firstName, lastName, email, password) {
    const existing = await getUserByEmail(email);

    if(existing) {
        throw new Error('Email is taken');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User({
        firstName,
        lastName,
        email,
        hashedPassword
    });
    await user.save();
    return user;
    

}
async function login(email, password) {
    const user = await getUserByEmail(email);
    if(!user) {
        throw new Error('Incorrect email or password');
    }
    const hasMatch = await bcrypt.compare(password, user.hashedPassword);

    if(hasMatch == false) {
        throw new Error('Incorect email or password');
    }
    return user;
   
    
}
async function getUserByEmail(email) {
    const user = await User.findOne({email: new RegExp(`^${email}$`, 'i')});

    return user;
}
    
module.exports = {
    register,
    login,
    
};