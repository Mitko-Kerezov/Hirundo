var events = require('../data/events');

module.exports = {
    getHome: function(req, res, next) {
        events.getPast(function(err, data) {
            res.render('index', {events: data})
        });
    }
};