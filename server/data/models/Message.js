var mongoose = require('mongoose');

module.exports.init = function() {
    var messageSchema = new mongoose.Schema({
        body: { type: String, required: true, maxlength: 140 },
        place: { type: String },
        hashTags: { type: [String], index: true },
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    });
    messageSchema.index({ body: 'text' });

    var Message = mongoose.model('Message', messageSchema);

    module.exports.seedInitialEvents = function() {
        return Message.find({}).exec((err, collection) => {
            if (err) {
                console.log('Cannot find events:', err);
                return;
            }

            var users = require('../users');
            users.findByUsername("generatedUser", (userFindError, generatedUser) => {
                if (userFindError) {
                    console.log('Cannot find generated user:', userFindError);
                    return;
                }

                if (collection.length === 0) {
                    Message.create({
                        body: 'Simple message #simple',
                        place: 'Sofia',
                        hashTags: ['simple'],
                        authorId: generatedUser._id
                    });

                    console.log('Sample events added to database...');
                }
            })
        });
    };
};


