var messages = require('../data/messages');

module.exports = {
    getHome: function(req, res, next) {
        res.render('index')
    }
};