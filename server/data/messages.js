var Message = require('mongoose').model('Message');

// var DEFAULT_PAGE_SIZE = 10;

// module.exports = {
//     create: function(event, callback) {
//         Message.create(event, callback);
//     },
//     update: function(conditions, update, options, callback) {
//         Message.update(conditions, update, options, callback);
//     },
//     getUpcoming: function(callback) {
//         Message.find({date: {"$gte": new Date()}}, callback);
//     },
//     getUpcomingPage: function(page, callback) {
//         Message
//             .find({date: {"$gte": new Date()}})
//             .limit(DEFAULT_PAGE_SIZE)
//             .skip(DEFAULT_PAGE_SIZE * page)
//             .exec(callback);
//     },
//     getPastPage: function(page, callback) {
//         Message
//             .find({date: {"$lte": new Date()}})
//             .limit(DEFAULT_PAGE_SIZE)
//             .skip(DEFAULT_PAGE_SIZE * page)
//             .exec(callback);
//     },
//     getPast: function(callback) {
//         Message.find({date: {"$lte": new Date()}}, callback);
//     },
//     findById: function(id, callback) {
//         Message.findOne({_id: id}, callback);
//     }
// };