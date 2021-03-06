var mongoose = require('mongoose'),
    MessageModel = require('../data/models/Message'),
    UserModel = require('../data/models/User');

module.exports = function(config) {
    mongoose.connect(config.db);
    var db = mongoose.connection;

    db.once('open', function(err) {
        if (err) {
            console.error('Database could not be opened: ' + err);
            return;
        }

        console.log('Database up and running...')
    });

    db.on('error', function(err){
        console.error('Database error: ' + err);
    });

    UserModel.init();
    MessageModel.init();
    UserModel.seedInitialUsers().then(MessageModel.seedInitialEvents);
};