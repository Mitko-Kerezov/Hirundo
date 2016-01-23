var encryption = require('../utilities/encryption');
var validation = require('../utilities/validation');
var users = require('../data/users');
var fs = require('fs');
var User = require('mongoose').model('User');


var CONTROLLER_NAME = 'users';

module.exports = {
    getRegister: function(req, res, next) {
        res.render(CONTROLLER_NAME + '/register')
    },
    postRegister: function(req, res, next) {
        var fstream;
        req.pipe(req.busboy);
        var userData = {};

        req.busboy.on('file', function (fieldname, file, filename) {
            var date = new Date().getTime();
            fstream = fs.createWriteStream(__dirname + '/../../public/img/' + date + filename);
            file.pipe(fstream);
            userData.avatar = date + filename;
            if (userData.avatar == date) {
                userData.avatar = 'default-avatar.jpg';
            }
        });

        req.busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
            if (fieldname === 'username') {
                if (!validation.checkUsername(val)) {
                    req.session.error = 'Username must be between 6 and 20 characters long and can contain only latin letters, digits, underscore, space and dots!';
                }
            }
            if (fieldname === 'initiativeAndSeason') {
                val = val.split(', ');
            }
            userData[fieldname] = val;
        });

        req.busboy.on('finish', function () {
            if (!req.session.error) {
                if (userData.password != userData.confirmPassword) {
                    req.session.error = 'Passwords do not match!';
                    res.redirect('/register');
                    return;
                }

                users.findByUsername(userData.username, function (err, user) {
                    if (!!user) {
                        req.session.error = 'Username already taken!';
                        res.redirect('/register');
                        return;
                    }
                });

                userData.salt = encryption.generateSalt();
                userData.hashPass = encryption.generateHashedPassword(userData.salt, userData.password);
                users.create(userData, function (err, user) {
                    if (err) {
                        console.log('Failed to register new user: ' + err);
                        return;
                    }

                    req.logIn(user, function (err) {
                        if (err) {
                            res.status(400);
                            return res.send({reason: err.toString()});
                        }
                        else {
                            res.redirect('/');
                        }
                    })
                });
            }
            else {
                res.redirect('/register');
                return;
            }
        });
    },
    getLogin: function(req, res, next) {
        res.render(CONTROLLER_NAME + '/login');
    },
    getProfile: function(req, res, next) {
        res.render(CONTROLLER_NAME + '/profile');
    },
    getAvatar: function(req, res, next) {
        res.render(CONTROLLER_NAME + '/avatar');
    },
    postAvatar: function(req, res, next) {
        var fstream;
        req.pipe(req.busboy);
        var oldAvatar = req.user.avatar;
        var newAvatar = '';
        req.busboy.on('file', function (fieldname, file, filename) {
            var date = new Date().getTime();
            fstream = fs.createWriteStream(__dirname + '/../../public/img/' + date + filename);
            file.pipe(fstream);
            newAvatar = date + filename;
        });

        req.busboy.on('finish', function () {
            var conditions = { _id: req.user._id }
                , update = {$set: {avatar: newAvatar}}
                , options = {};
            users.update(conditions, update, options, function(err, numAffected) {
                if (err) {
                    console.log('Failed to change avatar: ' + err);
                    return;
                }
                if (oldAvatar !== 'default-avatar.jpg') {
                    fs.unlink(__dirname + '/../../public/img/' + oldAvatar, function (err) {
                        if (err) throw err;
                        console.log('successfully deleted the old avatar');
                    });
                }
           });
        });

        res.redirect('/avatar');

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
        var conditions = { _id: req.user._id }
            , update = {$set: {hashPass: newHashPass}}
            , options = {};

        users.update(conditions, update, options, function(err, numAffected) {
            if (err) {
                console.log('Failed to change password: ' + err);
                return;
            }
            req.session.success = 'Password successfully changed!';
            res.redirect('/password');
        });
    },
    getPhoneNumber: function(req, res, next) {
        res.render(CONTROLLER_NAME + '/phonenumber');
    },
    postPhoneNumber: function(req, res, next) {
        var phoneNumber = req.body.phoneNumber;
        var conditions = { _id: req.user._id }
            , update = {$set: {phoneNumber: phoneNumber}}
            , options = {};

        users.update(conditions, update, options, function(err, numAffected) {
            if (err) {
                console.log('Failed to change password: ' + err);
                return;
            }
            req.session.success = 'Phone number added successfully!';
            res.redirect('/profile');
        });
    },
    getAddProfiles: function(req, res, next) {
        res.render(CONTROLLER_NAME + '/addprofiles');
    },
    postAddProfiles: function(req, res, next) {
        var profilesData = req.body;
        for (var profile in profilesData) {
            if (profilesData[profile] === '') {
                continue;
            }

            var conditions = { _id: req.user._id }
                , update = {}
                , options = {};

            switch (profile) {
                case 'facebook':
                    update = {$set: {facebook: profilesData[profile]}};
                    break;
                case 'twitter':
                    update = {$set: {twitter: profilesData[profile]}};
                    break;
                case 'linkedIn':
                    update = {$set: {linkedIn: profilesData[profile]}};
                    break;
                case 'google':
                    update = {$set: {google: profilesData[profile]}};
                    break;
            }

            users.update(conditions, update, options, function(err, numAffected) {
                if (err) {
                    console.log('Failed to change password: ' + err);
                    return;
                }
                req.session.success = 'Account added successfully!';
                res.redirect('/addprofiles');
            });
        }
    }
};