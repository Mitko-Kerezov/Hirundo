var events = require('../data/events');
var users = require('../data/users');

var CONTROLLER_NAME = 'events';

module.exports = {
    getEventCreation: function(req, res, next) {
        res.render(CONTROLLER_NAME + '/createEvent')
    },
    postEventCreation: function(req, res, next) {
        if(!req.user.phoneNumber) {
            req.session.error = 'You must provide a phone number in order to create an event!';
            res.redirect('/create');
            return;
        }

        var fstream;
        req.pipe(req.busboy);
        var eventData = {};

        req.busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
            if (fieldname === 'categories') {
                eventData[fieldname] = eventData[fieldname] || [];
                eventData[fieldname].push(val);
            }
            else {
                if (fieldname === 'initiative' || fieldname === 'season') {
                    if (fieldname === 'season' && !val) {
                        eventData['type'] = eventData['type'] || '';
                        eventData['type'] += 'Anyone ';
                    }
                    else {
                        eventData['type'] = eventData['type'] || '';
                        eventData['type'] += val + ' ';
                    }
                }
                else {
                    eventData[fieldname] = val;
                }
            }
        });

        req.busboy.on('finish', function () {
            eventData.creatorName = req.user.username;
            eventData.phoneNumber = req.user.phoneNumber;
            eventData.date = eventData.date || new Date();
            eventData.users = eventData.users || [];
            eventData.users.push(req.user.username);
            if (!eventData.categories) {
                req.session.error = 'Please choose at least one category!';
                res.redirect('/create');
                return;
            }
            events.create(eventData, function(err, event) {
                if (err) {
                    console.log('Failed to register new user: ' + err);
                    return;
                }
                var conditions = { _id: req.user._id }
                    , update = {$push: {eventsCreatedBy: eventData.title, eventsJoined: eventData.title}}
                    , options = {};

                users.update(conditions, update, options, function(err, numAffected) {
                    if (err) {
                        console.log('Failed to update user events: ' + err);
                        return;
                    }
                });

                req.session.success = 'Event successfully created!';
                res.redirect('/');
            });
        });
    },
    getPast: function(req, res, next) {
        var page = parseInt(req.params.page);
        page = page < 0 ? 0 : page;

        events.getPastPage(page, function(err, data) {
            data.sort(function(a, b) {
                a = new Date(a.date);
                b = new Date(b.date);
                return a>b ? -1 : a<b ? 1 : 0;
            });
            res.render(CONTROLLER_NAME + '/past', {events: data, currentPage: page});
        });
    },
    getEventById: function(req, res, next) {
        events.findById(req.param('id'), function(err, event) {
            if (err) {
                console.log(err);
                return;
            }

            var canJoin = false;
            var canLeave = false;
            var canEvaluate = false;

            //if the user doesn't have the required initiative and season
            var eventTypeSplit = event.type.split(' ');


            eventTypeSplit = eventTypeSplit.filter(function(v){return v!==''});
            if (eventTypeSplit.length == 2) {
                //this means that the event type is "Anyone Anyone"
                //so anyone can join
                canJoin = true;
            }
            else if (eventTypeSplit.length == 3) {
                //this means the season is 'Anyone'
                //because if the initiative is 'Anyone', the season automatically becomes 'Anyone'
                var initiative = eventTypeSplit[0] + ' ' + eventTypeSplit[1];
                for (var i = 0, len = req.user.initiativeAndSeason.length; i < len; ++i) {
                    if (req.user.initiativeAndSeason[i].indexOf(initiative) > -1) {
                        canJoin = true;
                        break;
                    }
                }
            }
            else {
                //here we have initiative-and-season-based, so we just check
                if (req.user.initiativeAndSeason.indexOf(event.type.trim()) > -1) {
                    canJoin = true;
                }
            }

            //or if the user has already joined
            if (event.users.indexOf(req.user.username) > -1) {
                canJoin = false;
                canLeave = true;
                if (event.date < new Date()) {
                    canEvaluate = true;
                }
            }

            res.render(CONTROLLER_NAME + '/details',
                {event: event, canJoin: canJoin, canLeave: canLeave, id: req.param('id'), canEvaluate: canEvaluate});
        });
    },
    joinEvent: function(req, res, next) {
        var id = req.param('id');
        events.findById(id, function(err, event) {
            var now = new Date();
            if (event.date < now) {
                req.session.error = 'Event has already passed!';
                res.redirect('/');
            }
            else {
                var conditions = { _id: id }
                    , update = {$push: {users: req.user.username}}
                    , options = {};

                events.update(conditions, update, options, function (err, numAffected) {
                    if (err) {
                        console.log('Failed to update events: ' + err);
                        return;
                    }
                });

                events.findById(id, function (err, event) {
                    conditions = { _id: req.user._id }
                    update = {$push: {eventsJoined: event.title}}
                    options = {};

                    users.update(conditions, update, options, function (err, numAffected) {
                        if (err) {
                            console.log('Failed to update events: ' + err);
                            return;
                        }
                    });
                });

                req.session.success = 'Event joined successfully!';
                res.redirect('/event/' + id);
            }
        });
    },
    leaveEvent: function(req, res, next) {
        var id = req.param('id');
        events.findById(id, function(err, event) {
            var now = new Date();
            if (event.date < now) {
                req.session.error = 'Event has already passed!';
                res.redirect('/');

            }
            else if (event.users.indexOf(req.user.username) < 0) {
                req.session.error = 'You need to be part of the event in order leave event!';
                res.redirect('/');

            }
            else {
                var conditions = { _id: id }
                    , update = {$pull: {users: req.user.username}}
                    , options = {};

                events.update(conditions, update, options, function (err, numAffected) {
                    if (err) {
                        console.log('Failed to update events: ' + err);
                        return;
                    }
                });

                events.findById(id, function (err, event) {
                    conditions = { _id: req.user._id }
                    update = {$pull: {eventsJoined: event.title}}
                    options = {};

                    users.update(conditions, update, options, function (err, numAffected) {
                        if (err) {
                            console.log('Failed to update events: ' + err);
                            return;
                        }
                    });
                });

                req.session.success = 'Event left successfully!';
                res.redirect('/event/' + id);
            }
        });
    },
    postComment: function(req, res, next) {
        var id = req.param('id');
        events.findById(id, function(err, event) {
            var now = new Date();
            if (event.users.indexOf(req.user.username) < 0) {
                req.session.error = 'You need to be part of the event in order to comment!';
                res.redirect('/');
            }
            else {
                var conditions = { _id: id }
                    , update = {$push: {comments: req.body.comment}}
                    , options = {};

                events.update(conditions, update, options, function (err, numAffected) {
                    if (err) {
                        console.log('Failed to update events: ' + err);
                        return;
                    }
                });
                req.session.success = 'Successfully posted comment!';
                res.redirect('/event/' + id);
            }
        });
    },
    getEvaluate: function(req, res, next) {
        var id = req.param('id');
        events.findById(id, function(err, event) {
            res.render(CONTROLLER_NAME + '/evaluate', {event: event});
        });
    },
    postEvaluate: function(req, res, next) {
        var id = req.param('id');
        events.findById(id, function(err, event) {
            if(event.date >= new Date()) {
                req.session.error = 'Event has not yet begun!';
                res.redirect('/');
            }
            else if (event.users.indexOf(req.user.username) < 0) {
                req.session.error = 'You need to be part of the event in order to rate!';
                res.redirect('/');
            }
            else {
                events.findById(id, function(err, event) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    var previousVenuePoints = event.venuePoints;
                    var previousOrganizationPoints = event.organizationPoints;

                    var evalData = req.body;
                    var conditions = { _id: id }
                        , update = {$set: {venuePoints: parseInt(evalData.venuePoints) + parseInt(previousVenuePoints),
                                           organizationPoints: parseInt(evalData.organizationPoints) + parseInt(previousOrganizationPoints)}}
                        , options = {};

                    events.update(conditions, update, options, function (err, numAffected) {
                        if (err) {
                            console.log('Failed to update events: ' + err);
                            return;
                        }
                    });

                    users.findByUsername(req.user.username, function(err, user) {
                        if (err) {
                            console.log(err);
                            return;
                        }

                        var previousEventPoints = user.eventPoints;

                        var eventPoints = parseInt(evalData.venuePoints) + parseInt(evalData.organizationPoints);
                        conditions = { _id: req.user._id }
                            , update = {$set: {eventPoints: parseInt(eventPoints) + parseInt(previousEventPoints)}}
                            , options = {};

                        users.update(conditions, update, options, function (err, numAffected) {
                            if (err) {
                                console.log('Failed to update users: ' + err);
                                return;
                            }
                        });

                        req.session.success = 'Event successfully rated!';
                        res.redirect('/');
                    });
                });
            }
        });
    },
    getListEvents: function(req, res, next) {
        var page = parseInt(req.params.page);
        page = page < 0 ? 0 : page;

        events.getUpcomingPage(page, function(err, data) {
            data.sort(function(a, b) {
                a = new Date(a.date);
                b = new Date(b.date);
                return a<b ? -1 : a>b ? 1 : 0;
            });
            res.render(CONTROLLER_NAME + '/list', {events: data, currentPage: page});
        });
    }
};