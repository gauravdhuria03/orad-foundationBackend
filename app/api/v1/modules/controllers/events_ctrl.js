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
    eventscategoriesModel = require('../models/eventscategories'),
    eventsModel = require('../models/events');
   


module.exports = {
   
    getEventsCategoriesList:getEventsCategoriesList,
    getEventsList:getEventsList,
    getEventDetails:getEventDetails,
    deleteFromBackend:deleteFromBackend
   
};




/**
 * getEventDetails API 
 * @access private
 * @return json
 * Created by sukhdev singh
 * Created Date 19-06-2021
 */

 function getEventDetails(req, res) {
    
    async function getEventDetails() {
        try {
            let Condition = {
                _id: mongoose.Types.ObjectId(req.params.id)
            }
            console.log(Condition, 'Condition');
            let eventData = await query.findoneData(eventsModel, Condition);
            
        
            if (eventData.status == true && eventData.data) {
                return res.json(Response(200, "Event available", eventData.data));
            }
            else {
                return res.json(Response(500, constant.validateMsg.internalError));
            }
        }
        catch (err) {
            console.log(err);
            return res.json(Response(500, constant.validateMsg.internalError, err));
        }

    }
    getEventDetails().then(function (data) { });
}
/**
 * function  API 
 * @access private
 * @return json
 * Created by gaurav Dhuria
 * Created Date 7-01-2021
 */

 function getEventsList(req, res) {
    
    async function getEventsList() {
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
        
            let resultObject = await query.findDataBySortSkipLimit(eventsModel, condition, sortObject, count, skip);
            console.log("resultObject==",resultObject);                      
            let totalCount = await query.countData(eventsModel, condition);
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
    getEventsList().then(function (data) { });
}
/**
 *  Delete insider from backend
 * @access private
 * @return json
 * Created by Gaurav
 * 
 * Created Date 21-06-2021
 */
 function deleteFromBackend(req, res) {
    let insiderId = req.body.insiderId;
    console.log("insiderId====", insiderId);
    async function deleteFromBackend() {
        try {
            let cond = {
                _id: insiderId
            }
            var Obj = {
                isDeleted: req.body.isDeleted ? req.body.isDeleted : false
                
                
            }
            let finalResult = await query.updateOneDocument(InsiderModel, cond, Obj);
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

 function getEventsCategoriesList(req, res) {
    
    async function getEventsCategoriesList() {
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
        
            let resultObject = await query.findDataBySortSkipLimit(eventscategoriesModel, condition, sortObject, count, skip);
            console.log("resultObject==",resultObject);                      
                                             

                
                if (resultObject.status == true && resultObject.data) {
                    if (resultObject.data.length > 0) {
                        
                            res.json({
                                code: constant.statusCode.ok,
                                data: resultObject.data,
                                message: "Data available"
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
    getEventsCategoriesList().then(function (data) { });
}





