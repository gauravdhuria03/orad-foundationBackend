module.exports = function (router) {

    var utils = require('../../../../lib/util');
    var jwt = require('../../../../lib/jwt');
    var multer = require('../../../../lib/multer');
    var middlewares = [utils.ensureAuthorized];
    var user = require('./controllers/user_ctrl');
    
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
    router.get('/users/list', user.usersList);
    router.get('/users/details/:id', user.getUserDetails);
    
    
    
    
    return router; 
}
