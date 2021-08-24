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
    SponsorshipModel = require('../models/sponsorship');
   


module.exports = {
   
    getSponsorshipList:getSponsorshipList,
    deleteFromBackend:deleteFromBackend,
    add:add
};

/**
 * add of new sponsor 
 * @access private
 * @return json
 * Created by Gaurav Dhuria
 * Created Date  12-6-2021
 */

 function add(req, res) {
    async function add() {
        try {                                 
        var Obj = {
            companyName: req.body.companyName ? req.body.companyName : '',
            companyContactName: req.body.companyContactName ? req.body.companyContactName : '',
            companyPhoneNumber: req.body.companyPhoneNumber ? req.body.companyPhoneNumber : '',
            email: req.body.email ? req.body.email.trim().toLowerCase() : '',            
            companyWebsite: req.body.companyWebsite ? req.body.companyWebsite : '', 
            levelOfSponsership: req.body.levelOfSponsership ? req.body.levelOfSponsership : '', 
            companyWebsite: req.body.companyWebsite ? req.body.companyWebsite : '',    
            companyAddress1: req.body.companyAddress1 ? req.body.companyAddress1 : '',    
            companyAddress2: req.body.companyAddress2 ? req.body.companyAddress2 : '',   
            comment: req.body.comment ? req.body.comment : '',    
            updatedAt: moment().unix(),
            createdAt: moment().unix()
        };
    
        var saveObj = await query.uniqueInsertIntoCollection(SponsorshipModel, Obj);
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
 *  Delete sponsorship from backend
 * @access private
 * @return json
 * Created by Gaurav
 * 
 * Created Date 21-06-2021
 */
 function deleteFromBackend(req, res) {
    let sponsorshipId = req.body.sponsorshipId;
    console.log("sponsorshipId====", sponsorshipId);
    async function deleteFromBackend() {
        try {
            let cond = {
                _id: sponsorshipId
            }
            var Obj = {
                isDeleted: req.body.isDeleted ? req.body.isDeleted : false
                
                
            }
            let finalResult = await query.updateOneDocument(SponsorshipModel, cond, Obj);
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

 function getSponsorshipList(req, res) {
    
    async function getSponsorshipList() {
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
        
            let resultObject = await query.findDataBySortSkipLimit(SponsorshipModel, condition, sortObject, count, skip);
            console.log("resultObject==",resultObject);                      
            let totalCount = await query.countData(SponsorshipModel, condition);
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
    getSponsorshipList().then(function (data) { });
}





