var UsersController = require('./UsersController');
var MessagesController = require('./MessagesController');
var HomeController = require('./HomeController');

module.exports = {
    users: UsersController,
    messages: MessagesController,
    home: HomeController
};