'use strict';

const util = require('util'),
    validator = require('../../../../../app/lib/validator'),
    unirest = require("unirest"),
    fs = require('fs'),
    moment = require('moment'),
    utility = require('../../../../../app/lib/utility.js'),
    uploadFile  = require('../../../../../app/lib/uploadEvent.js'),

    Error = require('../../../../../app/lib/error.js'),
    Response = require('../../../../../app/lib/response.js'),
    constant = require('../../../../../app/lib/constants'),    
    query = require('../../../../../app/lib/common_query'),
    common = require('../../../../../app/lib/common'),
    eventscategoriesModel = require('../models/eventscategories'),
    eventsModel = require('../models/events');
   
    const mongoose = require('mongoose');
    const commonQuery = {};

module.exports = {
   
    getEventsCategoriesList:getEventsCategoriesList,
    getEventsList:getEventsList,
    getEventDetails:getEventDetails,
    deleteFromBackend:deleteFromBackend,
    updateEvent:updateEvent,
    uploadImage:uploadImage,
    add:add
    
};
commonQuery.mongoObjectId = function (data) {
    if (data && data !== null && data !== undefined) {
        return mongoose.Types.ObjectId(data);
    } else {
        return false;
    }
}

/**
 * function  API 
 * @access private
 * @return json
 * Created by gaurav Dhuria
 * Created Date 7-01-2021
 */

 async function getEventsCategoriesList(req, res) {
    
        try {
            let condition = {
                isActive:true,
                isDeleted: false
            }
            const eventCategoData = await eventscategoriesModel.aggregate([
                {
                  $match: condition
                },                
                {
                  $lookup: {
                    from: 'events',
                    localField: '_id',
                    foreignField: 'category_id',
                    as: 'events'
                  }
                },
              ]);

              console.log("eventCategoData==",eventCategoData);

              if (eventCategoData.length > 0) {
                        
                res.json({
                    code: constant.statusCode.ok,
                    data: eventCategoData,
                    message: "Data available",
                    totalCount: eventCategoData.length
                })
            
            } else {
                res.json({ code: constant.statusCode.ok, data: [], message: constant.validateMsg.noRecordFound })
            }
            
            
        }
        catch (err) {
            console.log(err);
            return res.json(Response(500, constant.validateMsg.internalError, err));
        }


}


/**
 *  uploadImage
 * @access private
 * @return json
 * Created by Sukhdev Singh
 * 
 * Created Date 4-April-2021
 */
 async function uploadImage(req, res) {
 
  
        try {
            console.log("req-=====",req.file);
            
            
            if (req.file == undefined) {
              return res.status(400).send({ message: "Please upload a file!"});
              
            }
        
            res.status(200).send({
              message: "Uploaded the file successfully: " + req.file.originalname,
              data:req.file
              
            });
          } catch (err) {
              console.log("errorrrr==",err);
            res.status(500).send({
              message: `Could not upload the file: ${req.file.originalname}. ${err}`,
            });
          }
   
}

/**
 *  Update Event
 * @access private
 * @return json
 * Created by Sukhdev Singh
 * 
 * Created Date 4-April-2021
 */
 function updateEvent(req, res) {
 
    async function updateEvent() {
        try {
            let cond = {
                _id: req.body.id
            }          
            var eventObj = {
                title: req.body.title ? req.body.title : '',
                overview: req.body.overview ? req.body.overview : '',
                zoomLink: req.body.zoomLink ? req.body.zoomLink : '',
                zoomId: req.body.zoomId ? req.body.zoomId : '',
                category_id: req.body.category_id ? req.body.category_id : '',
                startDate: req.body.startDate ? req.body.startDate : '',
                endDate: req.body.endDate ? req.body.endDate : '',
                startTime: req.body.startTime ? req.body.startTime : '',
                endTime: req.body.endTime ? req.body.endTime : '',
                image: req.body.image ? req.body.image : '',
            }
            console.log("eventObj==", eventObj);
            let finalResult = await query.updateOneDocument(eventsModel, cond, eventObj);
            if (!finalResult.status) {
                return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.internalError, finalResult.error));
            }
            else {
                return res.json(Response(constant.statusCode.ok, constant.messages.eventupdate, finalResult.data));
            }

        } catch (error) {
            console.log(error);
            return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.internalError));
        }
    }
    updateEvent().then(function (data) { });
}

/**
 * add new event 
 * @access private
 * @return json
 * Created by Gaurav Dhuria
 * Created Date  12-6-2021
 */

 function add(req, res) {
    async function add() {
        try {                                 
        var Obj = {
            title: req.body.title ? req.body.title : '',
            overview: req.body.overview ? req.body.overview : '',
            zoomLink: req.body.zoomLink ? req.body.zoomLink : '',
            zoomId: req.body.zoomId ? req.body.zoomId : '',
            category_id: req.body.category_id ? req.body.category_id : '',
            startDate: req.body.startDate ? req.body.startDate : '',
            endDate: req.body.endDate ? req.body.endDate : '',
            startTime: req.body.startTime ? req.body.startTime : '',
            endTime: req.body.endTime ? req.body.endTime : '',
            image: req.body.image ? req.body.image : '',          
            updatedAt: moment().unix(),
            createdAt: moment().unix()
        };
    
        var saveObj = await query.uniqueInsertIntoCollection(eventsModel, Obj);
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
            //console.log("resultObject==",resultObject);                      
            let totalCount = await query.countData(eventsModel, condition);
            //console.log("totalCount==",totalCount);                                     

                
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






