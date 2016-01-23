var mongoose = require('mongoose'),
    encryption = require('../../utilities/encryption');

module.exports.init = function() {
    var userSchema = mongoose.Schema({
        username: { type: String, require: '{PATH} is required', unique: true },
        avatar: { type: String, required: true},
        salt: { type: String, required: true},
        hashPass: { type: String, required: true},
        eventPoints: { type: Number, default: 0},
        firstName: { type: String, required: true},
        lastName: { type: String, required: true},
        phoneNumber: String,
        email: { type: String, required: true, unique: true},
        initiativeAndSeason: { type: [String], required: true},
        facebook: String,
        twitter: String,
        linkedIn: String,
        google: String,
        eventsCreatedBy: [String],
        eventsJoined: [String]
    });

    userSchema.method({
        authenticate: function(password) {
            if (encryption.generateHashedPassword(this.salt, password) === this.hashPass) {
                return true;
            }
            else {
                return false;
            }
        }
    });

    var User = mongoose.model('User', userSchema);

    module.exports.seedInitialUsers = function() {
        User.find({}).exec(function(err, collection) {
            if (err) {
                console.log('Cannot find users: ' + err);
                return;
            }

            if (collection.length === 0) {
                var salt;
                var hashedPwd;

                salt = encryption.generateSalt();
                hashedPwd = encryption.generateHashedPassword(salt, '1234');

                User.create({
                    username: 'peshoPeshov',
                    salt: salt,
                    hashPass: hashedPwd,
                    avatar: 'default-avatar.jpg',
                    venuePoints: 0,
                    organizationPoints: 0,
                    firstName: 'Pesho',
                    lastName: 'Petrov',
                    phoneNumber: '0123456789',
                    email: 'pesho@gmail.com',
                    initiativeAndSeason: [ "School Academy Started 2012", "Software Academy Started 2013" ],
                    eventsCreatedBy: ['Sample event in the past', 'Sample event in the far past',
                        'Sample event in the future', 'Sample event in the far future', 'Server side paging test 0',
                        'Server side paging test 1', 'Server side paging test 2','Server side paging test 3',
                        'Server side paging test 4','Server side paging test 5','Server side paging test 6',
                        'Server side paging test 7','Server side paging test 8','Server side paging test 9',
                        'Server side paging test 10'],
                    eventsJoined: ['Sample event in the past', 'Sample event in the far past',
                        'Sample event in the future', 'Sample event in the far future', 'Server side paging test 0',
                        'Server side paging test 1', 'Server side paging test 2','Server side paging test 3',
                        'Server side paging test 4','Server side paging test 5','Server side paging test 6',
                        'Server side paging test 7','Server side paging test 8','Server side paging test 9',
                        'Server side paging test 10']
                });

                console.log('User peshoPeshov with pass 1234 added to database...');
            }
        });
    };
};


