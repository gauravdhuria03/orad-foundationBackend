'use strict';
const constant = require('./constants');
const mongoose = require('mongoose');
const mailer = require('./mailer');
const fs = require("fs");
const commonQuery = {};
let SALT_WORK_FACTOR = 10;
let bcrypt = require('bcrypt');
let _ = require('lodash');

commonQuery.saltThePassword = function saltThePassword(pwd) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
            if (err) {
                reject({
                    status: false,
                    error: err
                });
            } else {
                bcrypt.hash(pwd, salt, (err, hash) => {
                    if (err) {
                        reject(   {
                            status: false,
                            error: err
                        });
                    } else {
                        resolve({
                            status: true,
                            value: hash
                        })
                    }

                });
            }

        });
    })
}

commonQuery.findoneDataWithLookup = function findoneDataWithLookup(model, cond) {
    return new Promise(function (resolve, reject) {
         console.log("Errrr= ", cond);
        model.findOne(cond,function (err, userData) {

             console.log("Errrr= ", err, userData);

            let tempObj={};
            if (err) {
                 tempObj = {
                    status: false,
                    error:err,
                    data:null
                }
                reject(tempObj);
            } else {
                tempObj.status = true;
                tempObj.data = userData;
                resolve(tempObj);
            }

        });
    })

}

commonQuery.findoneData = function findoneData(model, cond) {
    return new Promise(function (resolve, reject) {
         console.log("Errrr= ", cond);
        model.findOne(cond,function (err, userData) {

             console.log("Errrr= ", err, userData);

            let tempObj={};
            if (err) {
                 tempObj = {
                    status: false,
                    error:err,
                    data:null
                }
                reject(tempObj);
            } else {
                tempObj.status = true;
                tempObj.data = userData;
                resolve(tempObj);
            }

        });
    })

}

commonQuery.findData = function findData(model, cond, fetchVal, sortBY = '') {
    return new Promise(function (resolve, reject) {
        let tempObj = {
            status: false
        }
        if (sortBY) {
            var sort_by = sortBY
        } else {
            var sort_by = {
                _id: 'desc'
            };
        }
        console.log("model===",model);
        model.find(cond, fetchVal).sort(sort_by).exec(function (err, userData) {
            if (err) {
                tempObj.error = err;
                reject(tempObj);
            } else {
                tempObj.status = true;
                tempObj.data = userData;
                resolve(tempObj);
            }
        });
    })
}

/**
 * Function is use to Fetch all data by sort, skip, limit
 * @access private
 * @return json
 * Created by Gaurav Dhuria 
 * Created Date 10-06-2021
 */
commonQuery.findDataBySortSkipLimit = function findDataBySortSkipLimit(model, cond, sort_by, count, skip) {
    return new Promise(function (resolve, reject) {
        let tempObj = {
            status: false
        }

        model.find(cond).sort(sort_by)
            .limit(parseInt(count))
            .skip(parseInt(skip))
            .exec(function (err, userData) {
                if (err) {
                    tempObj.error = err;
                    reject(tempObj);
                } else {
                    tempObj.status = true;
                    tempObj.data = userData;
                    resolve(tempObj);
                }
            });
    })
}




/**
 * Function is use to Fetch Multiple data with populate
 * @access private
 * @return json
 * Created by Gaurav Dhuria 
 * Created Date 10-06-2021
 */
commonQuery.findDataWithPopulate = function findDataWithPopulate(model, cond, populate) {
    return new Promise(function (resolve, reject) {
        let tempObj = {
            status: false
        }
        model.find(cond).populate(populate).exec(function (err, userData) {
            if (err) {
                tempObj.error = err;
                reject(tempObj);
            } else {
                tempObj.status = true;
                tempObj.data = userData;
                resolve(tempObj);
            }
        });
    })
}


/**
 * Function is use to Fetch Multiple data with multiple populate
 * @access private
 * @return json
 * Created by Gaurav dhuria 
 * Created Date 10-06-2021
 */
commonQuery.findDataWithMultiplePopulate = function findDataWithMultiplePopulate(model, cond, populate1, populate2) {
    return new Promise(function (resolve, reject) {
        let tempObj = {
            status: false
        }
        model.find(cond).populate(populate1).populate(populate2).exec(function (err, userData) {
            if (err) {
                tempObj.error = err;
                reject(tempObj);
            } else {
                tempObj.status = true;
                tempObj.data = userData;
                resolve(tempObj);
            }
        });
    })
}

/**
 * Function is use to Fetch Multiple data with populate and limited count
 * @access private
 * @return json
 * Created by Gaurav Dhuria 
 * Created Date 10-06-2021
 */
commonQuery.findDataWithPopulateWithCount = function findDataWithPopulateWithCount(model, cond, populate, count) {
    return new Promise(function (resolve, reject) {
        let tempObj = {
            status: false
        }
        model.find(cond)
            .limit(parseInt(count))
            .populate(populate)
            .sort({
                updatedAt: 'descending'
            })
            .exec(function (err, userData) {
                if (err) {
                    tempObj.error = err;
                    reject(tempObj);
                } else {
                    tempObj.status = true;
                    tempObj.data = userData;
                    resolve(tempObj);
                }
            });
    })
}

/**
 * Function is use to Fetch Multiple data with populate and limited count as per createdAt descending order
 * @access private
 * @return json
 * Created by Gaurav Dhuria 
 * Created Date 10-06-2021
 */
commonQuery.findDataWithPopulateWithCountDescending = function findDataWithPopulateWithCountDescending(model, cond, populate, count) {
    return new Promise(function (resolve, reject) {
        let tempObj = {
            status: false
        }
        model.find(cond)
            .limit(parseInt(count))
            .populate(populate)
            .sort({
                createdAt: 'descending'
            })
            .exec(function (err, userData) {
                if (err) {
                    tempObj.error = err;
                    reject(tempObj);
                } else {
                    tempObj.status = true;
                    tempObj.data = userData;
                    resolve(tempObj);
                }
            });
    })
}

/**
 * Function is use to Fetch Multiple data with populate and limited count as per createdAt descending order for pagination
 * @access private
 * @return json
* Created by Gaurav Dhuria 
 * Created Date 10-06-2021
 */
commonQuery.findDataWithPopulateWithCountandPaginateDescending = function findDataWithPopulateWithCountandPaginateDescending(model, cond, populate, populate2, count, skip) {
    return new Promise(function (resolve, reject) {
        let tempObj = {
            status: false
        }

        // User.find(condition)
        // .limit(parseInt(count))
        // .skip(parseInt(skip))
        // .sort(sorting)
        // .lean()

        model.find(cond)
            .limit(parseInt(count))
            .populate(populate)
            .populate(populate2)
            .skip(parseInt(skip))
            .sort({
                createdAt: 'descending'
            })
            .exec(function (err, userData) {
                if (err) {
                    tempObj.error = err;
                    reject(tempObj);
                } else {
                    tempObj.status = true;
                    tempObj.data = userData;
                    resolve(tempObj);
                }
            });
    })
}

/**
 * Function is use to Fetch Multiple data and limited count
 * @access private
 * @return json
* Created by Gaurav Dhuria 
 * Created Date 10-06-2021
 */
commonQuery.findDataWithCount = function findDataWithCount(model, cond, count) {
    return new Promise(function (resolve, reject) {
        let tempObj = {
            status: false
        }
        model.find(cond)
            .limit(parseInt(count))
            .sort({
                createdAt: 'descending'
            })
            .exec(function (err, userData) {
                if (err) {
                    tempObj.error = err;
                    reject(tempObj);
                } else {
                    tempObj.status = true;
                    tempObj.data = userData;
                    resolve(tempObj);
                }
            });
    })
}

commonQuery.findoneDataWithPopulate = function findoneDataWithPopulate(model, cond, fetchVal, populate) {
    return new Promise(function (resolve, reject) {
        model.findOne(cond, fetchVal).populate(populate).exec(function (err, userData) {
            let tempObj = {
                status: false
            }
            if (err) {
                tempObj.error = err;
                reject(tempObj);
            } else {
                tempObj.status = true;
                tempObj.data = userData;
                resolve(tempObj);
            }
        });
    })
}

/**
 * Function is use to Fetch Single data with populate
 * @access private
 * @return json
* Created by Gaurav Dhuria 
 * Created Date 10-06-2021
 */
commonQuery.findoneWithPopulate = function findoneWithPopulate(model, cond, populate) {
    return new Promise(function (resolve, reject) {
        model.findOne(cond).populate(populate).exec(function (err, userData) {
            let tempObj = {
                status: false
            }
            if (err) {
                tempObj.error = err;
                reject(tempObj);
            } else {
                tempObj.status = true;
                tempObj.data = userData;
                resolve(tempObj);
            }
        });
    })
}

/**
 * Function is use to send mail
 * @access private
 * @return json
* Created by Gaurav Dhuria 
 * Created Date 10-06-2021
 */
commonQuery.sendEmailFunction = function sendEmailFunction(obj) {
    try {
        let dataObj
        // console.log("dataObjdataObj", obj.data)
        dataObj = obj.data;
        let mailObjRes = {}
        let mailKeyword = ''
        var mailData = {
            userId: dataObj.userId ? dataObj.userId : "",
            email: dataObj.email ? dataObj.email : "",
            firstName: dataObj.firstName ? dataObj.firstName : '',
            lastName: dataObj.lastName ? dataObj.lastName : '',
            userName: dataObj.userName ? dataObj.userName : '',
            password: dataObj.password ? dataObj.password : '',
        };

        if (obj.mailType == constant.varibleType.FORGET_PASSWORD) { //'Forget Password'
            delete mailData['userName'];
            mailKeyword = constant.emailKeyword.forgotPassword;
            mailData.newpasswordlink = dataObj.link;
            // console.log("FORGET_PASSWORDFORGET_PASSWORD mailData", mailData, "mailKeyword", mailKeyword)
        }

        
        return new Promise(function (resolve, reject) {

            console.log("--email----------", mailData.email);

            mailer.sendMail(mailData.email, mailKeyword, mailData, function (err, resp) {
                // console.log("response=========");
                if (err) {
                    // console.log("errrorrrrrrrrrr",err)
                    mailObjRes.status = false
                    mailObjRes.err = err
                    reject(mailObjRes);
                } else {
                    console.log("success mailObjRes+++++++++++++++", resp)
                    mailObjRes.status = true
                    mailObjRes.resp = resp
                    resolve(mailObjRes);
                }
            });
        });
    }
    catch (error) {
        console.log("error----------------------", error);
        //    res.json({
        //        code : constant.statusCode.error,
        //        message : error
        //    })
    }

}

/**
 * Function is use to Fetch Single data with populate in descending order
 * @access private
 * @return json
 * Created by Gaurav Dhuria 
 * Created Date 10-06-2021
 */
commonQuery.findoneDataWithPopulateInDesc = function findoneDataWithPopulateInDesc(model, cond, populate) {
    return new Promise(function (resolve, reject) {
        let tempObj = {
            status: false
        }
        model.findOne(cond).sort({
            createdAt: 'descending'
        }).populate(populate.path).exec(function (err, userData) {
            if (err) {
                tempObj.error = err;
                reject(tempObj);
            } else {
                tempObj.status = true;
                tempObj.data = userData;
                resolve(tempObj);
            }
        });
    })
}


commonQuery.findById = function findById(model, cond) {
    return new Promise(function (resolve, reject) {
        model.findById(cond, function (err, userData) {
            if (err) {
                reject(err);
            } else {
                resolve(userData);
            }

        });
    })
}

commonQuery.updatedById = function updatedById(model) {
    return new Promise(function (resolve, reject) {
        model.save(function (err, userData) {
            if (err) {
                reject(err);
            } else {
                resolve(userData);
            }
        });
    })
}

commonQuery.lastInsertedId = function lastInsertedId(model) {
    return new Promise(function (resolve, reject) {
        model.findOne().sort({
            id: -1
        }).exec(function (err, data) {
            if (err) {
                resolve(0);
            } else {
                if (data) {
                    var id = data.id + 1;
                } else {
                    var id = 1;
                }
            }
            resolve(id);
        });
    })
}


commonQuery.InsertIntoCollection = function InsertIntoCollection(model, obj) {
    return new Promise(function (resolve, reject) {
        new model(obj).save(function (err, userInfo) {
            let tempObj = {
                status: false
            }
            if (err) {
                tempObj.error = err;
                reject(tempObj);
            } else {
                tempObj.status = true;
                tempObj.data = userInfo;
                resolve(tempObj);
            }
        });
    })
}

commonQuery.InsertManyIntoCollection = function InsertManyIntoCollection(model, arr) {
    return new Promise(function (resolve, reject) {
        try {
            model.insertMany(arr, function (err, userInfo) {
                let tempObj = {
                    status: false
                }
                if (err) {
                    tempObj.error = err;
                    reject(tempObj);
                } else {
                    tempObj.status = true;
                    tempObj.data = userInfo;
                    resolve(tempObj);
                }
            });
        } catch (error) {
            console.log(" on insert many ::userInfo::>", error);
        }

    })
}

commonQuery.fileUpload = function fileUpload(imagePath, buffer) {
    return new Promise((resolve, reject) => {
        try {
            let tempObj = {
                status: false
            }
            fs.writeFile(imagePath, buffer, function (err) {
                if (err) {
                    tempObj.error = err;
                    reject(err);
                } else {
                    tempObj.status = true;
                    tempObj.message = 'uploaded';
                    resolve(tempObj);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

commonQuery.FileExist = function FileExist(imagePath, noImage, imageloc) {
    return new Promise(function (resolve, reject) {
        utility.fileExistCheck(imagePath, function (exist) {
            if (!exist) {
                resolve(constant.config.baseUrl + noImage);
            } else {
                resolve(constant.config.baseUrl + imageloc);
            }
        });
    })
}

commonQuery.deleteFile = function deleteFile(filePath) {
    return new Promise(function (resolve, reject) {
        fs.unlink(filePath, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve("success");
            }
        });
    })
}

commonQuery.updateOneDocument = function updateOneDocument(model, updateCond, userUpdateData) {
    return new Promise(function (resolve, reject) {
        console.log("updateCond", updateCond)
        model.findOneAndUpdate(updateCond, {
            $set: userUpdateData
        })
            .lean().exec(function (err, userInfoData) {
                console.log("sefsdfsdfsdfsdf  errerrerr", err)
                let tempObj = { 
                    status: false
                }
                if (err) {
                    tempObj.error = err;
                    console.log("err", err);
                    reject(tempObj);
                } else {
                    tempObj.status = true;
                    tempObj.data = userInfoData;
                    resolve(tempObj);
                }
            });
    })
}


commonQuery.pushObjIntoDocument = function pushObjIntoDocument(model, updateCond, userUpdateData) {
    return new Promise(function (resolve, reject) {
        model.findOneAndUpdate(updateCond, {
            $push: userUpdateData
        }).lean().exec(function (err, userInfoData) {

            let tempObj = {
                status: false
            }
            if (err) {
                tempObj.error = err;
                console.log("err", err);
                reject(tempObj);
            } else {
                tempObj.status = true;
                tempObj.data = userInfoData;
                resolve(tempObj);
            }
        });
    })
}

commonQuery.pullObjFromDocument = function pullObjFromDocument(model, updateCond, userUpdateData) {
    return new Promise(function (resolve, reject) {
        model.findOneAndUpdate(updateCond, {
            $pull: userUpdateData
        }).lean().exec(function (err, userInfoData) {
            let tempObj = {
                status: false
            }
            if (err) {
                tempObj.error = err;
                console.log("err", err);
                reject(tempObj);
            } else {
                tempObj.status = true;
                tempObj.data = userInfoData;
                resolve(tempObj);
            }
        });
    })
}



/**
 * Function is use to Update One Document contains an array field
 * @access private
 * @return json
* Created by Gaurav Dhuria 
 * Created Date 10-06-2021
 */
commonQuery.updateDocumentwithArrayField = function updateDocumentwithArrayField(model, updateCond, userUpdateData) {

    return new Promise(function (resolve, reject) {
        // let obj = { status: false };
        model.findOneAndUpdate(updateCond,
            userUpdateData
        )
            .lean().exec(function (err, userInfoData) {
                let tempObj = {
                    status: false
                }
                if (err) {
                    tempObj.error = err;
                    reject(tempObj);
                } else {
                    tempObj.status = true;
                    tempObj.data = userInfoData;
                    resolve(tempObj);
                }
            });
    })
}

/**
 * Function is use to Update All Document
 * @access private
 * @return json
 * Created by Gaurav Dhuria 
 * Created Date 10-06-2021
 */
commonQuery.updateAllDocument = function updateAllDocument(model, updateCond, userUpdateData) {
    return new Promise(function (resolve, reject) {
        let tempObj = {
            status: false
        }
        model.update(updateCond, {
            $set: userUpdateData
        }, {
            multi: true
        })
            .lean().exec(function (err, userInfoData) {
                if (err) {
                    tempObj.error = err;
                    reject(tempObj);
                } else {
                    tempObj.status = true;
                    tempObj.data = userInfoData;
                    resolve(tempObj);
                }
            });
    })
}


/**
 * Function is used to Update multiple document with different conditions
 * @access private
 * @return json
* Created by Gaurav Dhuria 
 * Created Date 10-06-2021
 */
commonQuery.updateMultipleDocument = function updateMultipleDocument(model, updateCond, userUpdateData) {
    return new Promise(function (resolve, reject) {
        let tempObj = {
            status: false
        }

        model.bulkWrite(userUpdateData.map((obj) => {
            let updateObj = obj;
            let filterId = obj._id;
            delete updateObj._id; //delete _id from update object

            return {
                updateOne: {
                    filter: {
                        _id: filterId
                    },
                    update: {
                        $set: updateObj
                    },
                    upsert: true
                },
            };
        }))
            .then(userInfoData => {

                console.log("success ----", userInfoData);

                tempObj.status = true;
                tempObj.data = userInfoData;
                resolve(tempObj);

            })
            // .catch((e) => reject(e));
            .catch((err) => {
                console.log("error ----", err);

                tempObj.error = err;
                reject(tempObj);
            });
    })
}

commonQuery.fetch_all = function fetch_all(model, cond, fetchd) {
    return new Promise(function (resolve, reject) {
        model.find(cond, fetchd).exec(function (err, userData) {
            if (err) {
                reject(err);
            } else {
                resolve(userData);
            }

        });
    })
}

commonQuery.countData = function countData(model, cond) {
    let tempObj = {
        status: false
    }
    return new Promise(function (resolve, reject) {
        model.count(cond).exec(function (err, userData) {
            if (err) {
                tempObj.error = err;
                reject(tempObj);
            } else {
                tempObj.status = true;
                tempObj.data = userData;
                resolve(tempObj);
            }

        });
    })
}

commonQuery.fetchAllLimit = function fetchAllLimit(query) {
    return new Promise(function (resolve, reject) {
        query.exec(function (err, userData) {
            if (err) {
                reject(err);
            } else {
                resolve(userData);
            }
        });
    })
}

commonQuery.uniqueInsertIntoCollection = function uniqueInsertIntoCollection(model, obj) {
    let result = {
        status: false
    }
    //console.log("\n uniqueInsertntoCollection called \n", obj);
    return new Promise(function (resolve, reject) {
        new model(obj).save(function (err, userData) {
            if (err) {
                // console.log("\n uniqueInsertIntoCollection error \n", err);
                result.status = false;
                result.err = err;
                console.log("result", result)
                reject(result);
            } else {
                result.status = true;
                result.userData = userData;
                console.log("YYYYYYYY", result)
                resolve(result);
            }
        });
    })
}

commonQuery.deleteOneDocument = function deleteOneDocument(model, cond) {
    let result = {
        status: false
    }

    return new Promise(function (resolve, reject) {
        model.deleteOne(cond).exec(function (err, userData) {
            if (err) {
                result.err = err
                reject(result);
            } else {
                result.status = true
                result.userData = userData
                resolve(result);
            }

        });
    })
}

commonQuery.deleteManyfromCollection = function deleteManyfromCollection(model, obj) {
    return new Promise(function (resolve, reject) {
        model.deleteMany(obj, function (error, inserted) {
            if (error) {
                resolve(0);
            } else {
                resolve(1);
            }

        });
    })
}

/**
 * Function is use to Fetch all availability data in ascending order by startDate
 * @access private
 * @return json
* Created by Gaurav Dhuria 
 * Created Date 10-06-2021
 */
commonQuery.findAvailabilityDataBySort = function findAvailabilityDataBySort(model, cond) {
    return new Promise(function (resolve, reject) {
        let tempObj = {
            status: false
        }
        model.find(cond).sort({
            startDate: 1
        }).exec(function (err, userData) {
            if (err) {
                tempObj.error = err;
                reject(tempObj);
            } else {
                tempObj.status = true;
                tempObj.data = userData;
                resolve(tempObj);
            }
        });
    })
}

/**
 * Function is use to Fetch all availability data in descending order by startDate
 * @access private
 * @return json
* Created by Gaurav Dhuria 
 * Created Date 10-06-2021
 */
commonQuery.findAvailabilityDataBySortDescending = function findAvailabilityDataBySortDescending(model, cond) {
    return new Promise(function (resolve, reject) {
        let tempObj = {
            status: false
        }
        model.find(cond).sort({
            endDate: -1
        }).exec(function (err, userData) {
            if (err) {
                tempObj.error = err;
                reject(tempObj);
            } else {
                tempObj.status = true;
                tempObj.data = userData;
                resolve(tempObj);
            }
        });
    })
}

commonQuery.dateToStringData = function dateToStringData(model, condi) {
    return new Promise((resolve, reject) => {
        model.aggregate(condi).exec(function (err, data) {
            if (err) {
                console.log('reject error ', err)
                reject(err);
            } else {
                resolve(data);
            }

        })
    })
}


// commonQuery.numberOfAssociatedUser = function numberOfAssociatedUser(model, condi) {
//     return new Promise((resolve, reject) => {
//         model.aggregate([
//             {$match: { userType: constant.UserTypes.staff, created_by_id: condi.created_by_id} },
//             {$project: { createdAt:1, email: 1, day: {$dayOfMonth: '$createdAt'}}},
//             {$match: {day: condi.day}},
//         ]).exec(function (err, data) {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(data);
//             }

//         })
//     })
// }


commonQuery.findoneBySort = function findoneBySort(model, condition, fetchVal, sortby) {
    return new Promise(function (resolve, reject) {

        if (!sortby) {
            sortby = {
                _id: -1
            };
        }
        model.findOne(condition, fetchVal).sort(sortby).exec(function (err, data) {
            if (err) {
                console.log('err---->>>>>', err);
                reject(err);
            } else {
                resolve(data);
            }
        });
    })
}


commonQuery.countStaffData = function countStaffData(model, cond) {
    return new Promise(function (resolve, reject) {
        model.countDocuments(cond).exec(function (err, userData) {
            if (err) {
                reject(err);
            } else {
                resolve(userData);
            }

        });
    })
}

commonQuery.FindOne = function FindOne(model, cond = {}, projection = {}) {
    return new Promise((resolve, reject) => {
        try {
            if (!model || !Object.keys(cond).length)
                return reject({
                    statusCode: 400,
                    message: !model ? 'table' : 'condition to find'
                });
            model.findOne(cond, projection).exec(function (err, data) {
                if (err) {
                    console.log(err);
                    return reject(err);
                } else {
                    console.log(data);
                    return resolve(data);
                }

            });
        } catch (error) {
            console.log(error);
            return reject({
                statusCode: 500,
                message: 'Internal server error'
            });
        }
    });
}

commonQuery.mongoObjectId = function (data) {
    if (data && data !== null && data !== undefined) {
        return mongoose.Types.ObjectId(data);
    } else {
        return false;
    }
}

commonQuery.bytesToSize = function (bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}


commonQuery.getValidationErrors = function (validationErrors) {
    let errorMsgList = [];
    // let errorPathList = [];
    try {

        /* ERROR MSG EXAMPLE: medicalnegligence validation failed: lawyer_id: Lawyer is required., firm_id: Firm id is required. */
        let splitAtColon = validationErrors.message.split(':');
        splitAtColon.splice(0, 1);
        errorMsgList = splitAtColon.toString().split(',');
        for (let i = 0; i < errorMsgList.length; i++) {

            // errorPathList.push(errorMsgList[i].trim());
            errorMsgList.splice(i, 1);
        }

        /* Create object as [{path: '',message: ''}] */
        // let errorObject =  _.zipWith(errorPathList, errorMsgList, function (a, b) {
        //     return {
        //         path: a,
        //         message: b
        //     }
        // });

    } catch (e) {
        errorMsgList = [];
    }

    return errorMsgList;
}
module.exports = commonQuery;