var auth = require('./auth'),
    controllers = require('../controllers');

module.exports = function(app) {
    app.get('/event/:id', auth.isAuthenticated, controllers.messages.getEventById);

    app.get('/past/:page', auth.isAuthenticated, controllers.messages.getPast);

    app.get('/list/:page', auth.isAuthenticated, controllers.messages.getListEvents);

    app.post('/join/:id', auth.isAuthenticated, controllers.messages.joinEvent);

    app.post('/leave/:id', auth.isAuthenticated, controllers.messages.leaveEvent);

    app.post('/comment/:id', auth.isAuthenticated, controllers.messages.postComment);

    app.get('/profile', auth.isAuthenticated, controllers.users.getProfile);

    app.get('/create', auth.isAuthenticated, controllers.messages.getEventCreation);
    app.post('/create', auth.isAuthenticated, controllers.messages.postEventCreation);

    app.get('/evaluate/:id', auth.isAuthenticated, controllers.messages.getEvaluate);
    app.post('/evaluate/:id', auth.isAuthenticated, controllers.messages.postEvaluate);

    app.get('/password', auth.isAuthenticated, controllers.users.getPassword);
    app.post('/password', auth.isAuthenticated, controllers.users.postPassword);

    app.get('/register', controllers.users.getRegister);
    app.post('/register', controllers.users.postRegister);

    app.get('/login', controllers.users.getLogin);
    app.post('/login', auth.login);
    app.get('/logout', auth.logout);

    app.get('/', controllers.home.getHome);

    app.get('*', controllers.home.getHome);
};