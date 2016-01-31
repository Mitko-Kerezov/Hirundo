var auth = require('./auth'),
    controllers = require('../controllers');

module.exports = function(app) {
    app.get('/profile', auth.isAuthenticated, controllers.users.getProfile);

    app.get('/create', auth.isAuthenticated, controllers.messages.getMessageCreation);
    app.post('/create', auth.isAuthenticated, controllers.messages.postMessageCreation);

    app.get('/password', auth.isAuthenticated, controllers.users.getPassword);
    app.post('/password', auth.isAuthenticated, controllers.users.postPassword);

    app.get('/register', controllers.users.getRegister);
    app.post('/register', controllers.users.postRegister);

    app.get('/follow', auth.isAuthenticated, controllers.users.getFollow);
    app.get('/follow/:id', auth.isAuthenticated, controllers.users.followUser);
    app.get('/unfollow/:id', auth.isAuthenticated, controllers.users.unfollowUser);

    app.get('/timeline', auth.isAuthenticated, controllers.messages.getTimeline);
    app.get('/mytimeline', auth.isAuthenticated, controllers.messages.getMyTimeline);

    app.get('/login', controllers.users.getLogin);
    app.post('/login', auth.login);
    app.get('/logout', auth.logout);

    app.get('/', controllers.home.getHome);

    app.get('*', controllers.home.getHome);
};