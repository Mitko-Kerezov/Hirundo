var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    development: {
        rootPath: rootPath,
        db: 'mongodb://localhost:27017/hirundo',
        port: process.env.PORT || 3000
    }
};