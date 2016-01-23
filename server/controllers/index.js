var UsersController = require('./UsersController');
var EventsController = require('./EventsController');
var HomeController = require('./HomeController');

module.exports = {
    users: UsersController,
    events: EventsController,
    home: HomeController
};