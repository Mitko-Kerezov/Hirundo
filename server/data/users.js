var User = require('mongoose').model('User');

module.exports = {
    create: function(user, callback) {
        User.create(user, callback);
    },
    update: function(conditions, update, options, callback) {
        User.update(conditions, update, options, callback);
    },
    findByUsername: function(username, callback) {
        User.findOne({username: username}, callback);
    },
    findById: function(id, callback) {
        User.findOne({_id: id}, callback);
    },
    getAllUsernames: function(callback) {
        User.find()
            .select("username")
            .sort({
                username: "asc"
            })
            .exec(callback);
    }
};