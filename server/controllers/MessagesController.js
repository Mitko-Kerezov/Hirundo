var messages = require('../data/messages');
var users = require('../data/users');
var util = require('util');

var CONTROLLER_NAME = 'messages';
var hashTagRegex = /#\S*/g;

module.exports = {
    getMessageCreation: function(req, res, next) {
        var messageData = {
            body: req.query.body && req.query.body.substr(0, 140) || '',
            place: req.query.place || ''
        }

        res.render(CONTROLLER_NAME + '/createMessage', { messageData: messageData });
    },
    postMessageCreation: function(req, res, next) {
        var messageData = req.body;

        if (!messageData.body) {
            req.session.error = "The message's body is required!";
        }

        if (messageData.body.length > 140) {
            req.session.error = util.format("The message's body is restricted to 140 characters! Your current number of characters is %s", messageData.body.length);
        }

        if (!req.session.error) {
            messageData.authorId = req.user._id;
            messageData.hashTags = messageData.body.match(hashTagRegex);
            messages.create(messageData, function(err, message) {
                if (err) {
                    console.error('Failed to post new message: ' + err);
                    res.redirect('/');
                    return;
                }

                req.session.success = 'Message successfully posted!';
                res.redirect('/');
            });
        } else {
            var redirectionString = util.format('/create?body=%s&place=%s', messageData.body, messageData.place)
            res.redirect(redirectionString);
        }
    },
    getTimeline: function(req, res, next) {
        getPostsAndRender(req, res, {authorId: {$in: req.user.following}});
    },
    getMyTimeline: function(req, res, next) {
        getPostsAndRender(req, res, {authorId: req.user._id});
    }
};


function getPostsAndRender(req, res, conditions) {
    messages.findAndPopulate(conditions, function (err, postsInDb) {
        if (err) {
            console.error('Failed to get timeline: ' + err);
            res.redirect('/');
            return;
        }

        var posts = postsInDb.map(function(post) {
            return {
                username: post.authorId.username,
                body: post.body,
                place: post.place,
                hashTags: post.hashTags
            }
        });

        res.render(CONTROLLER_NAME + '/timeline', { posts: posts });
    });
};