var mongoose = require('mongoose');

Date.prototype.addHours = function(h) {
   this.setTime(this.getTime() + (h*60*60*1000));
   return this;
}

module.exports.init = function() {
    var messageSchema = new mongoose.Schema({
        body: { type: String, required: true, maxlength: 140 },
        place: { type: String },
        hashTags: { type: [String], index: true },
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        authorName: { type: mongoose.Schema.Types.String, required: true },
        date: { type: Date, default: Date.now }
    })
    .index({ body: 'text' });

    var Message = mongoose.model('Message', messageSchema);

    module.exports.seedInitialEvents = function() {
        return Message.find({}).exec((err, collection) => {
            if (err) {
                console.error('Cannot find events:', err);
                return;
            }

            var users = require('../users');
            users.findByUsername("generatedUser", (userFindError, generatedUser) => {
                if (userFindError) {
                    console.error('Cannot find generated user:', userFindError);
                    return;
                }

                if (collection.length === 0) {
                    for (var index = 0; index < 10; ++index) {
                        var randomNumber = ~~(Math.random()*10)%3,
                            message = {
                                authorId: generatedUser._id,
                                authorName: generatedUser.username,
                                date: new Date(Date.now()).addHours(~~(Math.random()*100)%24)
                            };

                        if (randomNumber === 1) {
                            message.body =  'Simple message #simple Number ' + index;
                            message.place = 'Home';
                            message.hashTags = ['#simple'];
                        } else if (randomNumber === 2) {
                            message.body = 'Every other message is #special ' + index;
                            message.place = 'Sofia';
                            message.hashTags = ['#special'];
                        } else {
                            message.body = 'Simply special #simple #special  ' + index;
                            message.place = 'Varna';
                            message.hashTags = ['#simple', '#special'];
                        }


                        Message.create(message).then(function() {
                            console.log('Sample event added to database...');
                        });
                    }
                }
            })
        });
    };
};


