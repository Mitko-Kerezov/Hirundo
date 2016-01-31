var Message = require('mongoose').model('Message'),
    User = require('mongoose').model('User');


var NUMBER_OF_POSTS_LIMIT = 50,
    NUMBER_OF_USER_POSTS_CONTAINING_KEYWORD_LIMIT = 10,
    FIVE_MAJOR_BULGARIAN_CITIES = ["Sofia", "Plodvid", "Varna", "Burgas", "Ruse"];

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
    findPosts: function(conditions, callback) {
        Message.find(conditions, {
                authorName: 1,
                body: 1,
                place: 1,
                hashTags: 1,
                date: 1
            })
            .limit(NUMBER_OF_POSTS_LIMIT)
            .exec(callback);
    },
    getTopTenByKeyword: function(keyword, callback) {
        Message.aggregate([{
                $match: { $text: { $search: keyword } }
            }, {
                $group: { _id: "$authorName", count: { $sum: 1 } }
            }, {
                $sort: { count: -1 }
            }, {
                $limit: NUMBER_OF_USER_POSTS_CONTAINING_KEYWORD_LIMIT
            }, {
                $project: { _id: 0, authorName: "$_id", count: 1 }
            }], callback);
    },
    findPercentageMajorCities: function(authorId, callback) {
        Message.count({authorId : authorId}, function(err, totalDocuments) {
            if (err) {
                console.error(err);
                return;
            }

            Message.aggregate([{
                $match: { authorId : authorId, place: { $in: FIVE_MAJOR_BULGARIAN_CITIES } }
            }, {
                $group: { _id: null, count: { $sum: 1 } }
            }, {
                $project: {
                    percentage: {
                        $multiply: [{ $divide: [ 100, totalDocuments ] },"$count"]
                    }
                }
            }], callback);
        });
    },
    findPercentageTimespan: function(authorId, timespan, callback) {
        Message.count({authorId : authorId}, function(err, totalDocuments) {
            if (err) {
                console.error(err);
                return;
            }

            var o = {
                query: {
                    authorId : authorId
                },
                scope: {
                    timespan: timespan,
                    totalDocuments: totalDocuments
                },
                map: function() {
                    var currentHours = this.date.getHours(),
                        currentMinutes = this.date.getMinutes();
                    if ((timespan.startHour <= currentHours && currentHours < timespan.endHour) ||
                        (timespan.endHour === currentHours && currentMinutes === 0)) {
                        emit(this.authorName, {
                            percentage: 100 / totalDocuments
                        })
                    }
                },
                reduce: function(key, values){
                    var numberOfPosts = 0;
                    values.forEach(function() {
                        ++numberOfPosts
                    })

                    return 100 * numberOfPosts / totalDocuments;
                }
            };

            Message.mapReduce(o, callback);
        });
    }
};
