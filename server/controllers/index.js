var UsersController = require('./UsersController'),
    MessagesController = require('./MessagesController'),
    HomeController = require('./HomeController'),
    StatisicsController = require('./StatisticsController');

module.exports = {
    users: UsersController,
    messages: MessagesController,
    home: HomeController,
    statistics: StatisicsController
};