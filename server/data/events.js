var Event = require('mongoose').model('Event');

var DEFAULT_PAGE_SIZE = 10;

module.exports = {
    create: function(event, callback) {
        Event.create(event, callback);
    },
    update: function(conditions, update, options, callback) {
        Event.update(conditions, update, options, callback);
    },
    getUpcoming: function(callback) {
        Event.find({date: {"$gte": new Date()}}, callback);
    },
    getUpcomingPage: function(page, callback) {
        Event
            .find({date: {"$gte": new Date()}})
            .limit(DEFAULT_PAGE_SIZE)
            .skip(DEFAULT_PAGE_SIZE * page)
            .exec(callback);
    },
    getPastPage: function(page, callback) {
        Event
            .find({date: {"$lte": new Date()}})
            .limit(DEFAULT_PAGE_SIZE)
            .skip(DEFAULT_PAGE_SIZE * page)
            .exec(callback);
    },
    getPast: function(callback) {
        Event.find({date: {"$lte": new Date()}}, callback);
    },
    findById: function(id, callback) {
        Event.findOne({_id: id}, callback);
    }
};