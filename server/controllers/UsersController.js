var encryption = require('../utilities/encryption'),
    validation = require('../utilities/validation'),
    users = require('../data/users'),
    util = require('util'),
    fs = require('fs');


var CONTROLLER_NAME = 'users';

module.exports = {
    getRegister: function(req, res, next) {
        var userData = {
            username: req.query.username || '',
            email: req.query.email || ''
        }
        res.render(CONTROLLER_NAME + '/register', { userData: userData })
    },
    postRegister: function(req, res, next) {
        var userData = req.body;

        if (!userData.username || !userData.password || !userData.confirmPassword || !userData.email) {
            req.session.error = 'All fields are required!';
        }

        if (!validation.checkUsername(userData.username)) {
            req.session.error = 'Username must be between 6 and 20 characters long and can contain only latin letters, digits, underscore, space and dots!';
        }

        if (userData.password != userData.confirmPassword) {
            req.session.error = 'Passwords do not match!';
        }

        if (!req.session.error) {
            users.findByUsername(userData.username, (err, user) => {
                if (!!user) {
                    req.session.error = 'Username already taken!';
                    res.redirect('/register');
                    return;
                }

                userData.salt = encryption.generateSalt();
                userData.hashPass = encryption.generateHashedPassword(userData.salt, userData.password);
                users.create(userData, (err, user) => {
                    if (err) {
                        console.error('Failed to register new user: ' + err);
                        res.redirect('/register');
                        return;
                    }

                    req.logIn(user, (err) => {
                        if (err) {
                            res.status(400).send({reason: err.toString()});
                        } else {
                            res.redirect('/');
                        }
                    })
                });
            });
        } else {
            var redirectionString = util.format('/register?username=%s&email=%s', userData.username, userData.email)
            res.redirect(redirectionString);
        }
    },
    unfollowUser: function(req, res, next) {
        var id = req.params.id;
        users.findById(id, function(err, user) {
            if (err) {
                console.error(err);
                res.redirect('/');
                return;
            }

            if (!user) {
                req.session.error = "The user you want to unfollow does not exist!";
                res.redirect('/follow');
                return;
            }

            var conditions = { _id: req.user._id },
                update = {$pop: {following: id}},
                options = {};

            users.update(conditions, update, options, function(err, numAffected) {
                if (err) {
                    console.error(err);
                    res.redirect('/');
                    return;
                }

                req.session.success = 'Successfully unfollowed user!';
                res.redirect('/follow');
            });
        })
    },
    followUser: function(req, res, next) {
        var id = req.params.id;
        users.findById(id, function(err, user) {
            if (err) {
                console.error(err);
                res.redirect('/');
                return;
            }

            if (!user) {
                req.session.error = "The user you want to follow does not exist!";
                res.redirect('/follow');
                return;
            }

            var conditions = { _id: req.user._id },
                update = {$push: {following: id}},
                options = {};

            users.update(conditions, update, options, function(err, numAffected) {
                if (err) {
                    console.error(err);
                    res.redirect('/');
                    return;
                }

                req.session.success = 'Successfully followed user!';
                res.redirect('/follow');
            });
        })
    },
    getFollow: function(req, res, next) {
        users.getUsersNames(req.user._id, req.user.following, function(err, userObjects) {
            if (err) {
                console.error(err);
                res.redirect('/');
                return;
            }

            res.render(CONTROLLER_NAME + '/follow', { users: userObjects.map(function(el) {
                return {
                    _id: el._id,
                    username: el.username,
                    following: !!~req.user.following.indexOf(el._id)
                };
            }) });
        })
    },
    getLogin: function(req, res, next) {
        res.render(CONTROLLER_NAME + '/login');
    },
    getProfile: function(req, res, next) {
        res.render(CONTROLLER_NAME + '/profile');
    },
    getPassword: function(req, res, next) {
        res.render(CONTROLLER_NAME + '/password');
    },
    postPassword: function(req, res, next) {
        var passwordData = req.body;
        var currentHashPass = encryption.generateHashedPassword(req.user.salt, passwordData.oldPassword);
        if (currentHashPass !== req.user.hashPass) {
            req.session.error = 'Invalid old password';
            res.redirect('/password');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            req.session.error = 'Passwords do not match!';
            res.redirect('/password');
            return;
        }

        var newHashPass = encryption.generateHashedPassword(req.user.salt, passwordData.newPassword);
        var conditions = { _id: req.user._id },
            update = {$set: {hashPass: newHashPass}},
            options = {};

        users.update(conditions, update, options, function(err, numAffected) {
            if (err) {
                console.error('Failed to change password: ' + err);
                res.redirect('/password');
                return;
            }
            req.session.success = 'Password successfully changed!';
            res.redirect('/password');
        });
    }
};