module.exports = function (router) {

    var utils = require('../../../lib/util');
    var jwt = require('../../../lib/jwt');
    var multer = require('../../../lib/multer');
    var middlewares = [utils.ensureAuthorized];
    var user = require('./controllers/user_ctrl');

    var sponsorship = require('./controllers/sponsorship_ctrl');
    var insider = require('./controllers/insider_ctrl');
    var contacts = require('./controllers/contacts_ctrl');
    var events = require('./controllers/events_ctrl');
    
    
    router.post('/users/login', user.login);
    router.post('/users/adminlogin', user.adminlogin);
    
    router.post('/users/forgotPassword', user.forgotPassword);
    router.post('/users/userLogout',jwt, user.userLogout);
    router.post('/users/UserRegistration', user.UserRegistration);    
    router.post('/users/resetPassword', user.resetPassword);
    router.post('/users/changePassword',jwt, user.changePassword);            
    router.post('/users/updateDeviceToken',jwt, user.updateDeviceToken);
    router.post('/users/updateUserImage',jwt,multer.single('image'), user.updateUserImage);
    router.post('/users/updateProfile', jwt,user.updateProfile);
    router.post('/users/updateProfileFromBackend', user.updateProfileFromBackend);    
    router.post('/users/list', user.usersList);
    router.get('/users/details/:id', user.getUserDetails);

    /////////////////////Backend///////////////////////
    router.post('/users/delete', user.deleteFromBackend);
    router.post('/users/changeStatusFromBackend', user.changeStatusFromBackend);    
    /////////////////////sponsorship///////////////////////    
    router.post('/sponsorship/delete', sponsorship.deleteFromBackend);
    router.post('/sponsorship/getSponsorshipList', sponsorship.getSponsorshipList);

    /////////////////////insider///////////////////////    
    router.post('/insider/delete', insider.deleteFromBackend);
    router.post('/insider/getInsiderList', insider.getInsiderList);

    /////////////////////contacts///////////////////////    
    router.post('/contacts/delete', contacts.deleteFromBackend);
    router.post('/contacts/getContactsList', contacts.getContactsList);

    /////////////////////events///////////////////////    
    
    router.post('/events/getEventsList', events.getEventsList);
    router.get('/events/details/:id', events.getEventDetails);
    router.post('/events/categories/getEventsCategoriesList', events.getEventsCategoriesList);
    
    
    return router; 
}
