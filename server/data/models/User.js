var mongoose = require('mongoose'),
    encryption = require('../../utilities/encryption');

module.exports.init = function() {
    var UserSchema = new mongoose.Schema({
        username: { type: String, require: '{PATH} is required', unique: true },
        email: { type: String, required: true, unique: true},
        hashPass: { type: String, required: true},
        salt: { type: String, required: true},
        following: { type: [mongoose.Schema.Types.ObjectId], default: [], ref: 'User' },
        verified: { type: Boolean, default: false }
    })
    .method({
        authenticate: function(password) {
            if (encryption.generateHashedPassword(this.salt, password) === this.hashPass) {
                return true;
            }
            else {
                return false;
            }
        }
    });

    var User = mongoose.model('User', UserSchema);

    module.exports.seedInitialUsers = function() {
        return User.find({}).exec(function(err, collection) {
            if (err) {
                console.error('Cannot find users: ' + err);
                return;
            }

            if (collection.length === 0) {
                var salt;
                var hashedPwd;

                salt = encryption.generateSalt();
                hashedPwd = encryption.generateHashedPassword(salt, '1234');

                User.create({
                    username: 'generatedUser',
                    salt: salt,
                    hashPass: hashedPwd,
                    email: 'user@gmail.com'
                }).then(function(user) {
                    User.create({
                        username: 'followingUser',
                        salt: salt,
                        hashPass: hashedPwd,
                        email: 'follow@gmail.com',
                        following: [user._id]
                    }).then(function(){
                        console.log('User generatedUser with pass 1234 added to database...');
                    });
                });

                console.log('User followingUser with pass 1234 added to database...');
            }
        });
    };
};


