var auth = require('./auth'),
    controllers = require('../controllers');

module.exports = function(app) {
    app.get('/event/:id', auth.isAuthenticated, controllers.events.getEventById);

    app.get('/past/:page', auth.isAuthenticated, controllers.events.getPast);

    app.get('/list/:page', auth.isAuthenticated, controllers.events.getListEvents);

    app.post('/join/:id', auth.isAuthenticated, controllers.events.joinEvent);

    app.post('/leave/:id', auth.isAuthenticated, controllers.events.leaveEvent);

    app.post('/comment/:id', auth.isAuthenticated, controllers.events.postComment);

    app.get('/profile', auth.isAuthenticated, controllers.users.getProfile);

    app.get('/avatar', auth.isAuthenticated, controllers.users.getAvatar);
    app.post('/avatar', auth.isAuthenticated, controllers.users.postAvatar);

    app.get('/create', auth.isAuthenticated, controllers.events.getEventCreation);
    app.post('/create', auth.isAuthenticated, controllers.events.postEventCreation);

    app.get('/evaluate/:id', auth.isAuthenticated, controllers.events.getEvaluate);
    app.post('/evaluate/:id', auth.isAuthenticated, controllers.events.postEvaluate);

    app.get('/password', auth.isAuthenticated, controllers.users.getPassword);
    app.post('/password', auth.isAuthenticated, controllers.users.postPassword);

    app.get('/phonenumber', auth.isAuthenticated, controllers.users.getPhoneNumber);
    app.post('/phonenumber', auth.isAuthenticated, controllers.users.postPhoneNumber);

    app.get('/addprofiles', auth.isAuthenticated, controllers.users.getAddProfiles);
    app.post('/addprofiles', auth.isAuthenticated, controllers.users.postAddProfiles);

    app.get('/register', controllers.users.getRegister);
    app.post('/register', controllers.users.postRegister);

    app.get('/login', controllers.users.getLogin);
    app.post('/login', auth.login);
    app.get('/logout', auth.logout);

    app.get('/', controllers.home.getHome);

    app.get('*', controllers.home.getHome);
};