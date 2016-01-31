var Message = require('mongoose').model('Message');

var NUMBER_OF_POSTS_LIMIT = 50;

module.exports = {
    create: function(event, callback) {
        Message.create(event, callback);
    },
    update: function(conditions, update, options, callback) {
        Message.update(conditions, update, options, callback);
    },
    findById: function(id, callback) {
        Message.findOne({_id: id}, callback);
    },
    findByAuthorIds: function(authorIds, callback) {
        Message.find({authorId: {$in: authorIds}}, callback);
    },
    findAndPopulate: function(conditions, callback) {
        Message.find(conditions)
            .limit(NUMBER_OF_POSTS_LIMIT)
            .populate('authorId')
            .exec(callback);
    }
};