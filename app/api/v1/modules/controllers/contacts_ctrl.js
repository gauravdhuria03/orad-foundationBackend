'use strict';

const util = require('util'),
    validator = require('../../../../../app/lib/validator'),
    unirest = require("unirest"),
    fs = require('fs'),
    moment = require('moment'),
    utility = require('../../../../../app/lib/utility.js'),
    Error = require('../../../../../app/lib/error.js'),
    Response = require('../../../../../app/lib/response.js'),
    constant = require('../../../../../app/lib/constants'),    
    query = require('../../../../../app/lib/common_query'),
    common = require('../../../../../app/lib/common'),
    ContactsModel = require('../models/contacts');
   


module.exports = {
   
    getContactsList:getContactsList,
    deleteFromBackend:deleteFromBackend,
    add:add
};

/**
 * add of new contact 
 * @access private
 * @return json
 * Created by Gaurav Dhuria
 * Created Date  12-6-2021
 */

 function add(req, res) {
    async function add() {
        try {                                 
        var contObj = {
            userName: req.body.userName ? req.body.userName : '',
            cellPhone: req.body.cellPhone ? req.body.cellPhone : '',
            email: req.body.email ? req.body.email.trim().toLowerCase() : '',
            subject: req.body.subject ? req.body.subject : '',
            message: req.body.message ? req.body.message : '',                                                                         
            updatedAt: moment().unix(),
            createdAt: moment().unix()
        };
    
        var saveObj = await query.uniqueInsertIntoCollection(ContactsModel, contObj);
        if (!saveObj.status) {
            return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.internalError, saveObj.err));
        } else {                                                                         

            res.json({
                code: constant.statusCode.ok,//200,
                message: "Data submitted successfuly",
                data: saveObj.userData
            })
        }              
            
        } catch (error) {
            console.log("error", error);
            return res.json(Response(constant.statusCode.notFound));

        }
    }
    add().then(function (data) { })
}

/**
 *  Delete contact from backend
 * @access private
 * @return json
 * Created by Gaurav
 * 
 * Created Date 21-06-2021
 */
 function deleteFromBackend(req, res) {
    let contactId = req.body.contactId;
    console.log("contactId====", contactId);
    async function deleteFromBackend() {
        try {
            let cond = {
                _id: contactId
            }
            var Obj = {
                isDeleted: req.body.isDeleted ? req.body.isDeleted : false
                
                
            }
            let finalResult = await query.updateOneDocument(ContactsModel, cond, Obj);
            if (!finalResult.status) {
                return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.internalError, finalResult.error));
            }
            else {
                
                finalResult.data.isDeleted = true;
                
              
                
                return res.json(Response(constant.statusCode.ok, constant.statusCode.profileUpdated, finalResult.data));
            }

        } catch (error) {
            console.log(error);
            return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.internalError));
        }
    }
    deleteFromBackend().then(function (data) {
    });
}


/**
 * function  API 
 * @access private
 * @return json
 * Created by gaurav Dhuria
 * Created Date 7-01-2021
 */

 function getContactsList(req, res) {
    
    async function getContactsList() {
        try {
            let condition = {
                isActive:true,
                isDeleted: false
            }
            let count = req.body.count ? parseInt(req.body.count) : 20;
            let skip = 0;
            if (req.body.count && req.body.page) {
                skip = req.body.count * (req.body.page - 1);
            }
            let sortObject = {}
            if (req.body.sortValue && req.body.sortOrder) {
                sortObject[req.body.sortValue] = req.body.sortOrder;
            } else {
                sortObject = { _id: -1 }
            }
        
            let resultObject = await query.findDataBySortSkipLimit(ContactsModel, condition, sortObject, count, skip);
            console.log("resultObject==",resultObject);                      
            let totalCount = await query.countData(ContactsModel, condition);
            console.log("totalCount==",totalCount);                                                          

                
                if (resultObject.status == true && resultObject.data) {
                    if (resultObject.data.length > 0) {
                        
                            res.json({
                                code: constant.statusCode.ok,
                                data: resultObject.data,
                                message: "Data available",
                                totalCount: totalCount.data
                            })
                        
                    } else {
                        res.json({ code: constant.statusCode.ok, data: [], message: constant.validateMsg.noRecordFound })
                    }
                }
            
        }
        catch (err) {
            console.log(err);
            return res.json(Response(500, constant.validateMsg.internalError, err));
        }

    }
    getContactsList().then(function (data) { });
}





