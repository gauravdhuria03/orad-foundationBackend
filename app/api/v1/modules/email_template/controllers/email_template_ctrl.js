'use strict';

var mongoose = require('mongoose'),
    EmailTemplate = mongoose.model('emailTemplate'),
    utility = __rootRequire('app/lib/utility.js'),
    Error = __rootRequire('app/lib/error.js'),
    Response = __rootRequire('app/lib/response.js'),
    query = __rootRequire('app/lib/common_query'),
    constant = __rootRequire('app/lib/constants');

module.exports = {
    listEmailTemplate: listEmailTemplate,
    getEmailTemplateById: getEmailTemplateById,
    editEmailTemplate: editEmailTemplate,
    addEmailTemplate: addEmailTemplate,
    deleteEmailTemplate:deleteEmailTemplate
};

/**
 * Function is use to list email template
 * @access private
 * @return json
 * Created by Sanika
 * 
 * Created Date 22-Nov-2018
*/
function listEmailTemplate(req, res) {
    async function listEmailTemplateExe() {
        let count = req.body.count ? req.body.count : 0;
        let skip = req.body.count * (req.body.page - 1);
        let searchText = decodeURIComponent(req.body.searchText).replace(/[[\]{}()*+?,\\^$|#\s]/g, "\\s+");
        let condition = {};
        if (req.body && req.body.userType && req.body.created_by_id) {
            if (req.body.userType) {
                condition.$or = [{
                    isDeleted: false,
                    created_by_id: req.body.created_by_id,
                    isActive: false
                },
                {
                    isDeleted: false,
                    created_by_id: constant.admin.ID,
                    isActive: false
                }]
            }else if(req.body.defaultTemplate && req.body.userType=='admin'){
                condition = {
                    isDeleted: false,
                    isActive: false,
                    created_by_id : {"$exists" : true, "$eq" : null}
                }
            } 
            else {
                condition = {
                    isDeleted: false,
                    isActive: false,
                    created_by_id: {"$ne": null }
                };
            }
            if (req.body.searchText) {
                condition.$or = [{
                    'unique_keyword': new RegExp(searchText, 'gi')
                }];
            }
            try {
                var totalCount = 0;
                EmailTemplate.count(condition).exec(function (err, count) {
                    totalCount = count
                })
                EmailTemplate.find(condition)
                    .limit(parseInt(count))
                    .skip(parseInt(skip))
                    .sort({ 'title': 1 })
                    .lean()
                    .exec(function (err, result) {
                        if (err) {
                            res.json({ code: 402, message: constant.messages.commonError })
                        } else {
                            res.json({ code: 200, data: result, totalCount: totalCount, message: constant.messages.templateListing })
                        }
                    })
            } catch (error) {
                res.json({ code: 1004, message: constant.messages.requestNotProcessed })
            }
        } else {
            return res.json(Response(402, constant.validateMsg.requiredFieldsMissing));
        }
    }
    listEmailTemplateExe().then(function (data) { });

};

/**
 * Function is use to get particular template by id 
 * @access private
 * @return json
 * Created by Gaurav Dhuria
 * Created Date 
*/
function getEmailTemplateById(req, res) {
    async function getEmailTemplateByIdExe() {
        if (req.params && req.params.id) {
            let condition = {
                _id: req.params.id,
                isDeleted: false
            }

            try {

                var emailTemplateList = await query.findoneData(EmailTemplate, condition);
                if (emailTemplateList.status) {
                    res.json({ code: 200, data: emailTemplateList.data, message: constant.messages.templateDetails })
                } else {
                    res.json({ code: 401, message: constant.messages.commonError })
                }
            } catch (error) {

                res.json({ code: 1004, message: constant.messages.requestNotProcessed })
            }
        } else {
            return res.json(Response(402, constant.validateMsg.requiredFieldsMissing));
        }
    }
    getEmailTemplateByIdExe().then(function (data) { });

};

/**
 * Function is use to edit template 
 * @access private
 * @return json
 * Created by gaurav Dhuria
 * Created Date 26-Nov-2018
*/
function editEmailTemplate(req, res) {
    async function editEmailTemplateexe() {
        if (req.body && req.body.id) {
            var cond = {
                isDeleted: false, _id: req.body.id
            }

            var content = {
                title: req.body.title,
                subject: req.body.subject,
                description: req.body.description,
            }
            try {
                let result = await query.updateOneDocument(EmailTemplate, cond, content)
                if (!result.status) {
                    return res.json(Response(500, constant.validateMsg.internalError, result.error));
                }
                else {
                    return res.json(Response(200, constant.messages.templateUpdateSuccess, result.data));
                }
            }
            catch (err) {
                return res.json(Response(500, constant.validateMsg.internalError, err));
            }
        } else {
            return res.json(Response(402, constant.validateMsg.requiredFieldsMissing));
        }
    }
    editEmailTemplateexe().then(function (data) { });
}

/**
 * Function is use to add template 
 * @access private
 * @return json
 * Created by Gaurav dhuria
 
 * Created Date 25-Mar-2019
*/
function addEmailTemplate(req, res) {
    async function addEmailTemplateExe() {
        if (req.body && req.body.title && req.body.subject && req.body.description && req.body.created_by_id) {
           var randomString = utility.getEncryptText(Math.random().toString(4).slice(-10));

            var content = {
                title: req.body.title,
                subject: req.body.subject,
                description: req.body.description,
                created_by_id: req.body.created_by_id,
                unique_keyword: req.body.title + randomString.substring(0, 4)
            }
            try {
                let findOne = await query.findData(EmailTemplate, { unique_keyword: req.body.title });
                if (findOne && findOne.status && findOne.data.length > 1) {
                    return res.json(Response(200, constant.messages.emailTemplateAlreadyExist, findOne.data));
                } else {
                    let result = await query.InsertIntoCollection(EmailTemplate, content);
                    if (!result.status) {
                        return res.json(Response(500, constant.validateMsg.internalError, result.error));
                    }
                    else {
                        return res.json(Response(200, constant.messages.emailTemplateAddSuccess, result.data));
                    }
                }

            }
            catch (err) {
                return res.json(Response(500, constant.validateMsg.internalError, err));
            }
        } else {
            return res.json(Response(402, constant.validateMsg.requiredFieldsMissing));
        }
    }
    addEmailTemplateExe().then(function (data) { });
}

/**
 * Function is use to delete data
 * @access private
 * @return json
 * Created by Gaurav Dhuria * 
 * Created Date 5 Nov 2018
*/

function deleteEmailTemplate(req, res) {
    async function deleteEmailTemplateExe() {
        if (req.body && req.body.template_id) {
            let tempObj = {
                isDeleted: true,
            };
            let cond = { isDeleted: false, _id: req.body.template_id };
            try {
                let result = await query.updateOneDocument(EmailTemplate, cond, tempObj);
                if (!result.status) {
                   
                    return res.json(Response(500, constant.validateMsg.internalError, result.error));
                }
                else {
                    return res.json(Response(200, constant.messages.emailTemplateDeleteSuccess));
                }
            }
            catch (err) {
                return res.json(Response(500, constant.messages.commonError, err));
            }
        }
        else {
            return res.json(Response(402, constant.validateMsg.requiredFieldsMissing));
        }
    }
    deleteEmailTemplateExe().then(function (data) { });

};