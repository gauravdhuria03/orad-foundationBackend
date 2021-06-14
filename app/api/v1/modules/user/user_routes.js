module.exports = function (router) {

    var utils = require('../../../../lib/util');
    var jwt = require('../../../../lib/jwt');
    var multer = require('../../../../lib/multer');
    var middlewares = [utils.ensureAuthorized];
    var user = require('./controllers/user_ctrl');
    
    router.post('/user/login', user.login);
    router.post('/user/adminlogin', user.adminlogin);
    
    router.post('/user/forgotPassword', user.forgotPassword);
    router.post('/user/userLogout',jwt, user.userLogout);
    router.post('/user/UserRegistration', user.UserRegistration);    
    router.post('/user/resetPassword', user.resetPassword);
    router.post('/user/changePassword',jwt, user.changePassword);            
    router.post('/user/updateDeviceToken',jwt, user.updateDeviceToken);
    router.post('/user/updateUserImage',jwt,multer.single('image'), user.updateUserImage);
    router.post('/user/updateProfile',jwt, user.updateProfile);
    
    
    
    
    return router; 
}
