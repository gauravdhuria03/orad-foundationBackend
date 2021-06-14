module.exports = function (router) {
    
    var utils = __rootRequire('app/lib/util');
    var middlewares = [utils.ensureAuthorized];
    
    var emailTemplate = require('./controllers/email_template_ctrl');
  
    router.post('/emailTemplate/listEmailTemplate',middlewares, emailTemplate.listEmailTemplate);
    router.get('/emailTemplate/getEmailTemplateById/:id',middlewares, emailTemplate.getEmailTemplateById);
    router.post('/emailTemplate/editEmailTemplate',middlewares, emailTemplate.editEmailTemplate);
    router.post('/emailTemplate/addEmailTemplate',middlewares, emailTemplate.addEmailTemplate);
    router.post('/emailTemplate/deleteEmailTemplate',middlewares, emailTemplate.deleteEmailTemplate);
    
    
    return router;
}


