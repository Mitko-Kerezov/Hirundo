var mongoose = require('mongoose');

module.exports.init = function() {
    var eventSchema = mongoose.Schema({
        title: { type: String, required: true},
        description: { type: String, required: true},
        location: { type: String},
        categories: { type: [String], required: true},
        type: { type: String, required: true},
        creatorName: { type: String, required: true},
        phoneNumber: { type: String, required: true},
        date: {type: Date, default: new Date() },
        comments: {type: [String]},
        users: {type: [String]},
        venuePoints: { type: Number, default: 0},
        organizationPoints: { type: Number, default: 0}
    });

    var Event = mongoose.model('Event', eventSchema);

    module.exports.seedInitialEvents = function() {
        Event.find({}).exec(function(err, collection) {
            if (err) {
                console.log('Cannot find events: ' + err);
                return;
            }

            if (collection.length === 0) {
                var date = new Date();

                Event.create({
                    title: 'Sample event in the past',
                    description: 'A brief description',
                    categories: [ "Free time" ],
                    type: 'Software Academy Started 2013',
                    creatorName: 'peshoPeshov',
                    phoneNumber: '0123456789',
                    date: date.setDate(date.getDate() - 10),
                    users: ['peshoPeshov']
                });

                Event.create({
                    title: 'Sample event in the far past',
                    description: 'A brief description',
                    categories: [ "Free time" ],
                    type: 'Software Academy Started 2013',
                    creatorName: 'peshoPeshov',
                    phoneNumber: '0123456789',
                    date: date.setDate(date.getDate() - 5),
                    users: ['peshoPeshov']
                });

                Event.create({
                    title: 'Sample event in the future',
                    description: 'A brief description',
                    categories: [ "Free time" ],
                    type: 'Software Academy Started 2013',
                    creatorName: 'peshoPeshov',
                    phoneNumber: '0123456789',
                    date: date.setDate(date.getDate() + 30),
                    users: ['peshoPeshov']
                });

                Event.create({
                    title: 'Sample event in the far future',
                    description: 'A brief description',
                    categories: [ "Free time" ],
                    type: 'Software Academy Started 2013',
                    creatorName: 'peshoPeshov',
                    phoneNumber: '0123456789',
                    date: date.setDate(date.getDate() + 10),
                    users: ['peshoPeshov']
                });

                Event.create({
                    title: 'Server side paging test 0',
                    description: 'A brief description',
                    categories: [ "Free time" ],
                    type: 'Software Academy Started 2013',
                    creatorName: 'peshoPeshov',
                    phoneNumber: '0123456789',
                    date: date.setDate(date.getDate() + 10),
                    users: ['peshoPeshov']
                });

                Event.create({
                    title: 'Server side paging test 1',
                    description: 'A brief description',
                    categories: [ "Free time" ],
                    type: 'Software Academy Started 2013',
                    creatorName: 'peshoPeshov',
                    phoneNumber: '0123456789',
                    date: date.setDate(date.getDate() + 10),
                    users: ['peshoPeshov']
                });

                Event.create({
                    title: 'Server side paging test 2',
                    description: 'A brief description',
                    categories: [ "Free time" ],
                    type: 'Software Academy Started 2013',
                    creatorName: 'peshoPeshov',
                    phoneNumber: '0123456789',
                    date: date.setDate(date.getDate() + 10),
                    users: ['peshoPeshov']
                });

                Event.create({
                    title: 'Server side paging test 3',
                    description: 'A brief description',
                    categories: [ "Free time" ],
                    type: 'Software Academy Started 2013',
                    creatorName: 'peshoPeshov',
                    phoneNumber: '0123456789',
                    date: date.setDate(date.getDate() + 10),
                    users: ['peshoPeshov']
                });

                Event.create({
                    title: 'Server side paging test 4',
                    description: 'A brief description',
                    categories: [ "Free time" ],
                    type: 'Software Academy Started 2013',
                    creatorName: 'peshoPeshov',
                    phoneNumber: '0123456789',
                    date: date.setDate(date.getDate() + 10),
                    users: ['peshoPeshov']
                });

                Event.create({
                    title: 'Server side paging test 5',
                    description: 'A brief description',
                    categories: [ "Free time" ],
                    type: 'Software Academy Started 2013',
                    creatorName: 'peshoPeshov',
                    phoneNumber: '0123456789',
                    date: date.setDate(date.getDate() + 10),
                    users: ['peshoPeshov']
                });

                Event.create({
                    title: 'Server side paging test 6',
                    description: 'A brief description',
                    categories: [ "Free time" ],
                    type: 'Software Academy Started 2013',
                    creatorName: 'peshoPeshov',
                    phoneNumber: '0123456789',
                    date: date.setDate(date.getDate() + 10),
                    users: ['peshoPeshov']
                });

                Event.create({
                    title: 'Server side paging test 7',
                    description: 'A brief description',
                    categories: [ "Free time" ],
                    type: 'Software Academy Started 2013',
                    creatorName: 'peshoPeshov',
                    phoneNumber: '0123456789',
                    date: date.setDate(date.getDate() + 10),
                    users: ['peshoPeshov']
                });

                Event.create({
                    title: 'Server side paging test 8',
                    description: 'A brief description',
                    categories: [ "Free time" ],
                    type: 'Software Academy Started 2013',
                    creatorName: 'peshoPeshov',
                    phoneNumber: '0123456789',
                    date: date.setDate(date.getDate() + 10),
                    users: ['peshoPeshov']
                });

                Event.create({
                    title: 'Server side paging test 9',
                    description: 'A brief description',
                    categories: [ "Free time" ],
                    type: 'Software Academy Started 2013',
                    creatorName: 'peshoPeshov',
                    phoneNumber: '0123456789',
                    date: date.setDate(date.getDate() + 10),
                    users: ['peshoPeshov']
                });

                Event.create({
                    title: 'Server side paging test 10',
                    description: 'A brief description',
                    categories: [ "Free time" ],
                    type: 'Software Academy Started 2013',
                    creatorName: 'peshoPeshov',
                    phoneNumber: '0123456789',
                    date: date.setDate(date.getDate() + 10),
                    users: ['peshoPeshov']
                });

                console.log('Sample events added to database...');
            }
        });
    };
};


