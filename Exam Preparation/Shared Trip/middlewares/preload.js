const tripServices = require('../services/tripService')


function preload() {
    return async function(req, res, next) {
       const id = req.params.id;
       const trip = await tripServices.getTripById(id);
       res.locals.trip = trip; 
        next();
    }
}
module.exports = preload;