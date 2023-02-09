const mongoose = require('mongoose');
require('../models/User')
const CONNECTION_STRING = 'mongodb://localhost:27017/wildlifeDb';

module.exports = async (app) => {
    try{
        mongoose.set('strictQuery', false);
        mongoose.connect(CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        mongoose.connection.on('error', (err) => {
            console.error('Database error');
            console.error(err);
        })
    } catch (err){
        
        console.error(err.message);
        process.exit(1);
    }
};