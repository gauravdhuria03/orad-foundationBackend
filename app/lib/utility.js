'use strict';
/*
 * Utility - utility.js
 * Author: smartData Enterprises
 * Date: 15 th Oct 2018
 */
var constant = require('./constants');
var crypto = require('crypto'),
    algorithm = constant.cryptoConfig.cryptoAlgorithm,
    password = constant.cryptoConfig.cryptoPassword;
var fs = require("fs");
const CryptoJS = require("crypto-js");
var path = require('path');
var async = require('async');
var mongoose = require('mongoose');
var User = mongoose.model('user');
const validator = require('./validator');
var nodemailer = require('nodemailer');
var utility = {};
var q = require('q');
const webPush = require('web-push');
const config = require('../config/config').get(process.env.NODE_ENV);
const uuidv1 = require('uuid/v1');
const bcrypt = require('bcryptjs'),
    salt = bcrypt.genSaltSync(10);


utility.saltedPassword = function (password) {
    var hash = bcrypt.hashSync(password, salt);
    return hash;
}
utility.matchPassword = function (currentPassword, dbPassword) {
    var passwordFlag = bcrypt.compareSync(currentPassword, dbPassword);
    return passwordFlag;

}
utility.sendmail = function (to, subject, userData, html, callback) {
    var smtpTransport = nodemailer.createTransport({
        service: '',
        host: '',
        port: 465,
        secure: true,
        auth: {
            user: '',
            pass: ''
        }
    });


    var mailOptions = {
        to: userData.email,
        from: '',
        subject: subject,
        html: html
    };
    smtpTransport.sendMail(mailOptions, function (err) {
        if (err) {

            callback(err);
        } else {

            callback(null, true);
        }
    });
}

utility.dateToISOStringConvert = function (date) {
    var datearr = date.split("-");
    var dobj = new Date(parseInt(datearr[2]), parseInt(datearr[1]) - 1, parseInt(datearr[0]));
    date = dobj.toISOString();
    return date;
}

utility.getEncryptText = function (text) {
    var cipher = crypto.createCipher(algorithm, password);
    text = cipher.update(text, 'utf8', 'hex');
    text += cipher.final('hex');
    return text;
}

utility.getDecryptText = function (text) {
    return new Promise((resolve, reject) => {
        var decipher = crypto.createDecipher(algorithm, password)
        var text = decipher.update(text, 'hex', 'utf8')
        text += decipher.final('utf8');
        resolve(text);
    })
}

utility.encrypt = function (data) {
    return new Promise(resolve => {
        const ciphertext = CryptoJS.AES.encrypt(data, ('@#DialogflowVoiceBasedBot#@')).toString();
        console.log("ciphertext", typeof ciphertext)
        resolve(ciphertext);
    })
}
utility.decrypt = (data) => {
    return new Promise(resolve => {
        const bytes = CryptoJS.AES.decrypt(data.toString(), ('@#DialogflowVoiceBasedBot#@'));
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        console.log("decryptedData", decryptedData)

        resolve(decryptedData);
    })
}

utility.uploadImage = function (imageBase64, imageName, callback) {
    if (imageBase64 && imageName) {
        var timestamp = Number(new Date()); // current time as number
        var filename = +timestamp + '_' + imageName;
        var imagePath = "./public/assets/uploads/" + filename;
        fs.writeFile(path.resolve(imagePath), imageBase64, 'base64', function (err) {
            if (!err) {
                callback(config.webUrl + "/assets/uploads/" + filename);
            } else {
                callback(config.webUrl + "/assets/images/default-image.png");
            }
        });
    } else {
        callback(false);
    }
}

utility.fileExistCheck = function (path, callback) {
    fs.exists(path, function (err) {
        if (err) {
            callback(true);
        } else {
            callback(false);
        }
    });
}

utility.validationErrorHandler = function (err) {
    var errMessage = constant.validateMsg.internalError;
    if (err.errors) {
        for (var i in err.errors) {
            errMessage = err.errors[i].message;
        }
    }
    return errMessage;
}







utility.fileUpload = function (imagePath, buffer) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(path.resolve(imagePath), buffer, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

utility.getSortObj = function (body) {
    var sorting = { createdAt: -1 };
    for (var key in body) {
        var reg = new RegExp("sorting", 'gi');
        if (reg.test(key)) {
            var value = body[key];
            key = key.replace(/sorting/g, '').replace(/\[/g, '').replace(/\]/g, '');
            var sorting = {};
            sorting[key] = (value == 'desc') ? 1 : -1;
        }
    }
    return sorting;
}


utility.getFilterObj = function (body) {
    var filter = {};
    for (var key in body) {
        var reg = new RegExp("filter", 'gi');
        if (reg.test(key)) {
            var value = body[key];
            key = key.replace(/filter/g, '').replace(/\[/g, '').replace(/\]/g, '');
            filter[key] = value;
        }
    }
    return filter;
}

utility.userValidation = function (body) {
    let requiredFieldsMissing = constant.validateMsg.requiredFieldsMissing;
    let invalidEmail = constant.validateMsg.invalidEmail;
    if (!body.email || !body.password) { //!body.firstname || !body.lastname || !body.role || !body.clinicId || !body.userType || !body.createdId 
        return requiredFieldsMissing;
    } else if (body.email && !validator.isEmail(body.email)) {
        return invalidEmail;
    } else {
        return true;
    }
}


utility.clinicValidation = function (body) {
    let requiredFieldsMissing = constant.validateMsg.requiredFieldsMissing;
    let invalidEmail = constant.validateMsg.invalidEmail;
    if (!body.clinicName) {
        return requiredFieldsMissing;
    } else if (body.email && !validator.isEmail(body.email)) {
        return invalidEmail;
    } else {
        return true;
    }
}

utility.staffValidation = function (body) {
    let requiredFieldsMissing = constant.validateMsg.requiredFieldsMissing;
    let invalidEmail = constant.validateMsg.invalidEmail;
    if (!body.firstname || !body.lastname || !body.clinicId || !body.userType || !body.createdId || !body.roleId) { //|| !body.roleId
        return requiredFieldsMissing;
    } else if (body.email && !validator.isEmail(body.email)) {
        return invalidEmail;
    } else {
        return true;
    }
}

utility.uuid = {
    uuid: require('node-uuid'),
    v1: function () {
        return this.uuid.apply(this, arguments);  //.v1()
    }
}

utility.getUuid = function () {
    return new Promise((resolve, reject) => {
        try {
            let newUuid = uuidv1();
            resolve(newUuid);
        } catch (error) {
        }
    })
}

/**
 * Function is used for push notification
 * @access private
 * @return json
 * @input  object which contains the following parameter 
 * title , message , url ,ttl ,icon,image,badge,tag
 * @to     array which contains to ids if empty will treated as all
 * Created by prakash kumar soni
 * 
 * Created Date 13-Mar-2019
*/

// utility.pushNotification = function (input, to) {
//     return new Promise(function (resolve, reject) {
//         try {
//             const payload = {
//                 title: input.title ? input.title : "",
//                 message: input.message ? input.message : "",
//                 url: input.url ? input.url : "",
//                 ttl: input.ttl ? input.ttl : "",
//                 icon: input.icon ? input.icon : "",
//                 image: input.image ? input.image : "",
//                 badge: input.badge ? input.badge : "",
//                 tag: input.tag ? input.tag : "",
//             };
//             if (to && to.length > 0) {
//                 let i = 0;
//                 let len = to.length;
//                 for (i; i < len; i++) {
//                     sendNotification({ createdById: to[i] });
//                 }

//             } else {
//                 sendNotification({});
//             }
//             //obj of condition that subcription you want to send notification
//             function sendNotification(obj) {
//                 if (JSON.stringify(obj) !== '{}') {
//                     payload.for_id = obj.createdById
//                 }
//                 Subscription.find(obj, (err, subscriptions) => {
//                     if (err) {
//                         console.error("Error occurred while sending notification on finding subcription", err);
//                         return res.json(Response(500, constant.validateMsg.internalError, err));
//                     } else {
//                         let parallelSubscriptionCalls = subscriptions.map((subscription) => {
//                             return new Promise((resolve, reject) => {
//                                 const pushSubscription = {
//                                     endpoint: subscription.endpoint,
//                                     keys: {
//                                         p256dh: subscription.keys.p256dh,
//                                         auth: subscription.keys.auth
//                                     }
//                                 };

//                                 const pushPayload = JSON.stringify(payload);
//                                 const pushOptions = {
//                                     vapidDetails: {
//                                         subject: config.baseUrl,
//                                         privateKey: config.notify.privateKey,
//                                         publicKey: config.notify.publicKey
//                                     },
//                                     TTL: payload.ttl,
//                                     headers: {}
//                                 };
//                                 webPush.sendNotification(
//                                     pushSubscription,
//                                     pushPayload,
//                                     pushOptions
//                                 ).then((value) => {
//                                     resolve({
//                                         status: true,
//                                         endpoint: subscription.endpoint,
//                                         data: value
//                                     });
//                                 }).catch((err) => {
//                                     reject({
//                                         status: false,
//                                         endpoint: subscription.endpoint,
//                                         data: err
//                                     });
//                                 });
//                             });
//                         });
//                         q.allSettled(parallelSubscriptionCalls).then((pushResults) => {
//                             resolve({
//                                 status: true,
//                                 data: pushResults
//                             })
//                             console.info(pushResults);
//                         });
//                     }
//                 });
//             }
//         } catch (err) {
//             reject({
//                 status: false,
//                 data: err
//             });
//         }
//     })

// }
utility.getDateFromTimestamp = function getDateFromTimestamp(timestamp) {
    return new Date(timestamp * 1000)
}

utility.today_date = function today_date() {
    return new Promise((resolve, reject) => {
        try {
            const currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
            const day = currentDate.getDate()
            const month = currentDate.getMonth() + 1
            const year = currentDate.getFullYear()
            const today_date = day + "-" + month + "-" + year;
            resolve(today_date);
        } catch (error) {
            reject('Someting worng with the date')
        }

    });

}

utility.check_date = function check_date(timestamp) {
    return new Promise((resolve, reject) => {
        try {
            const today_date = new Date(timestamp * 1000);
            const day = today_date.getDate()
            const month = today_date.getMonth() + 1
            const year = today_date.getFullYear()
            const check_date = day + "-" + month + "-" + year;
            resolve(check_date);
        } catch (error) {
            reject('Someting worng with the date')
        }

    });

}

/**
 * Basic function of encryption 
 * @access private
 * @return json
 * Created by Prakash Kumar Soni
 * 
 * Created Date 8-June-2017
 */
utility.getEncryptText = function (text) {
    var cipher = crypto.createCipher(algorithm, password);
    text = cipher.update(text, 'utf8', 'hex');
    text += cipher.final('hex');
    return text;
}

utility.getDecryptText = function (text) {
    var decipher = crypto.createDecipher(algorithm, password)
    var text = decipher.update(text, 'hex', 'utf8')
    text += decipher.final('utf8');
    return text;
}

function encrypt(encText) {
    try {
        var cipher = crypto.createCipher(algorithm, password)
        var encText = cipher.update(encText, 'utf8', 'hex')
        encText += cipher.final('hex');
        return encText;
    } catch (ex) {
        console.log(' encrypt failed ');
        return;
    }
}

/**
 * Basic function of decryption 
 * @access private
 * @return json
 * Created by Prakash Kumar Soni
 * 
 * Created Date 8-June-2017
 */
function decrypt(decText) {

    var decipher = crypto.createDecipher(algorithm, password);
    try {
        if (decText && decText != '') {
            var n = decText.search("function");
            //  console.log("=== decText +"+n+"==="+JSON.stringify(decText));
            if (n == 0) {
                return true;
            } else {
                var decipher = crypto.createDecipher(algorithm, password)
                var decText1 = decipher.update(String(decText), 'hex', 'utf8')
                decText1 += decipher.final('utf8');
                return decText1;
            }

        }
        else {
            return true;
        }
    } catch (ex) {
        console.log(' decrypt failed ', ex);
        return true;
    }
}

/**
 * Function is use to validation in error handler 
 * @access private
 * @return json
 * Created by Prakash Kumar Soni
 * 
 * Created Date 8-June-2017
 */
utility.validationErrorHandler = function (err) {
    var errMessage = constantsObj.validationMessages.internalError;
    if (err.errors) {
        for (var i in err.errors) {
            errMessage = err.errors[i].message;
        }
    }
    return errMessage;
}

/**
 * Function is use to encrypt records 
 * @access private
 * @return json
 * Created by Prakash Kumar Soni
 * 
 * Created Date 8-June-2017
 */
utility.encryptedRecord = function encryptedRecord(data, field, callback) {
    var patientObj = {};
    var fields = [];
    if (field.length > 0) {
        for (var i = 0; i < field.length; i++) {
            fields.push(field[i]);
        };
    }
    for (var key in data) {
        if (fields.indexOf(key) == -1) {
            if (data[key]) {
                if (data[key] instanceof Array) {
                    if (data[key].length > 0) {
                        patientObj[key] = [];
                        for (let j = 0; j < data[key].length; j++) {

                            patientObj[key][j] = {};

                            if (typeof (data[key][j]) == 'object') {

                                for (var arrObjkey in data[key][j]) {
                                    if (fields.indexOf(arrObjkey) == -1) {
                                        if (data[key][j][arrObjkey]) {
                                            patientObj[key][j][arrObjkey] = encrypt(data[key][j][arrObjkey].toString());

                                        }
                                    } else {
                                        patientObj[key][j][arrObjkey] = data[key][j][arrObjkey];
                                    }
                                }
                            } else if (typeof (result[key][j]) == 'string') {
                                patientObj[key][j] = encrypt(result[key][j].toString());
                            }
                        }
                    } else {
                        patientObj[key] = data[key];
                    }
                } else {
                    patientObj[key] = encrypt(data[key].toString());
                }
            }
        } else {
            patientObj[key] = data[key];
        }

    }
    callback(patientObj);
}


utility.encryptedRecordPromise = function encryptedRecordPromise(data, field) {
    return new Promise(function (resolve, reject) {
        utility.encryptedRecord(data, field, function (data2) {
            resolve(data2)
        });
    })
}

/**
 * Function is use to decrypt records 
 * @access private
 * @return json
 * Created by Prakash Kumar Soni
 * 
 * Created Date 8-June-2017
 */
utility.decryptedRecord = function decryptedRecord(data, field, callback1) {
    // console.log("here is my data",data);
    var newArr = [];
    var fields = ['_id', 'createdAt', 'updatedAt']; //'is_deleted', 'status', '__v'
    if (field.length > 0) {
        for (var i = 0; i < field.length; i++) {
            fields.push(field[i]);
        };

    }
    //console.log("here is my fileds",fields);
    if (data instanceof Array) {
        async.each(data, function (result, callback) {
            var patientObj = {};
            for (var key in result) {
                //console.log("fields.indexOf(key)",fields.indexOf(key),key);
                if (fields.indexOf(key) == -1) {
                    if (result[key]) {
                        if (result[key] instanceof Array) {
                            if (result[key].length > 0) {
                                patientObj[key] = [];
                                for (let j = 0; j < result[key].length; j++) {
                                    patientObj[key][j] = {};
                                    if (typeof (result[key][j]) == 'object') {
                                        for (var arrObjkey in result[key][j]) {
                                            if (fields.indexOf(arrObjkey) == -1) {
                                                if (result[key][j][arrObjkey]) {
                                                    patientObj[key][j][arrObjkey] = decrypt(result[key][j][arrObjkey].toString());
                                                }
                                            } else {
                                                patientObj[key][j][arrObjkey] = result[key][j][arrObjkey];
                                            }
                                        }
                                    } else if (typeof (result[key][j]) == 'string') {
                                        patientObj[key][j] = decrypt(result[key][j].toString());
                                    }
                                }
                            } else {
                                patientObj[key] = result[key];
                            }

                        } else if (typeof (result[key]) == 'object') {
                            for (var objkey in result[key]) {
                                if (fields.indexOf(objkey) == -1) {
                                    if (result[key][objkey]) {
                                        if (typeof (result[key][objkey]) == 'object') {
                                            for (var arrObjkey1 in result[key][objkey]) {

                                                if (result.length) {
                                                    if (fields.indexOf(arrObjkey1) == -1) {
                                                        if (result[key][objkey][arrObjkey1]) {
                                                            patientObj[objkey][arrObjkey1] = decrypt(result[key][objkey][arrObjkey1].toString());
                                                        }
                                                    } else {
                                                        patientObj[objkey][arrObjkey1] = result[key][objkey][arrObjkey1];
                                                    }
                                                }
                                                else {

                                                    if (fields.indexOf(arrObjkey1) == -1) {
                                                        if (result.objkey) {
                                                            patientObj.objkey = decrypt(result.objkey.toString());
                                                        }
                                                    } else {
                                                        patientObj.objkey = result.objkey;
                                                    }
                                                }

                                            }
                                        }
                                        patientObj[objkey] = decrypt(result[key][objkey].toString());
                                    }
                                } else {
                                    patientObj[objkey] = result[objkey];
                                }
                            }

                        } else {
                            patientObj[key] = decrypt(result[key].toString());
                        }
                    }
                } else {
                    patientObj[key] = result[key];
                }
            }
            newArr.push(patientObj);
            callback(null);
        }, function (err) {
            callback1(newArr)
        });
    } else {
        var patientObj = {};
        for (var key in data) {
            if (fields.indexOf(key) == -1) {
                if (data[key]) {
                    if (data[key] instanceof Array) {
                        if (data[key].length > 0) {
                            patientObj[key] = [];
                            for (let j = 0; j < data[key].length; j++) {

                                patientObj[key][j] = {};

                                if (typeof (data[key][j]) == 'object') {

                                    for (var arrObjkey in data[key][j]) {
                                        if (fields.indexOf(arrObjkey) == -1) {
                                            if (data[key][j][arrObjkey]) {
                                                patientObj[key][j][arrObjkey] = decrypt(data[key][j][arrObjkey].toString());

                                            }
                                        } else {
                                            patientObj[key][j][arrObjkey] = data[key][j][arrObjkey];
                                        }
                                    }
                                } else if (typeof (result[key][j]) == 'string') {
                                    patientObj[key][j] = decrypt(result[key][j].toString());
                                }
                            }
                        } else {
                            patientObj[key] = data[key];
                        }
                    } else {
                        patientObj[key] = decrypt(data[key].toString());
                    }
                }
            } else {
                patientObj[key] = data[key];
            }
        }
        callback1(patientObj);
    }
}

/**
 * Function is use to encrypt password 
 * @access private
 * @return json
 * Created by Saurabh Udapure
 * 
 * Created Date 5-Aug-2019
 */
utility.saltedPassword = function (password) {
    var hash = bcrypt.hashSync(password, salt);
    return hash;
}

utility.matchPassword = function (currentPassword, dbPassword) {
    var passwordFlag = bcrypt.compareSync(currentPassword, dbPassword);
    return passwordFlag;
}

utility.ValidateRequiredFieldsInObj = function (obj, fields) {

    if (!obj || !fields) return 'Required fields are missing!!';

    fields = String(fields).split(',');

    let no_data_fields = [];

    for (let i = 0; i < fields.length; i++) {
        if (typeof obj[fields[i]] === 'boolean' && !(obj[fields[i]] === false || obj[fields[i]] === true)) {
            no_data_fields.push(fields[i]);
        } else if (typeof obj[fields[i]] === 'number' && !(obj[fields[i]] >= 0 || obj[fields[i]] < 0)) {
            // else if (typeof obj[fields[i]] !== 'number' && typeof obj[fields[i]] === 'boolean' && !(obj[fields[i]] === false || obj[fields[i]] === true)) {
            no_data_fields.push(fields[i]);
        } else if (typeof obj[fields[i]] !== 'number' && !obj[fields[i]]) {
            no_data_fields.push(fields[i]);
        }
    }

    return no_data_fields.length ? 'Required fields are missing!! Please pass ' + no_data_fields.join(', ') : false;
}

utility.genRandStr = digit => {
    let num = Number(digit)
    if (num) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < num; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    } else {
        return '';
    }
}

utility.IsNotValidMongoIds = function (obj, object_id_fields) {

    if (!obj || !object_id_fields) return 'Required fields are missing!!';

    const Mongoose = require('mongoose');

    object_id_fields = String(object_id_fields).split(',');

    let no_data_fields = [];

    for (let i = 0; i < object_id_fields.length; i++) {
        if (!Mongoose.Types.ObjectId.isValid(obj[String(object_id_fields[i]).trim()]))
            no_data_fields.push(object_id_fields[i])
    }

    return no_data_fields.length ? 'Invalid mongo id!! Please check ' + no_data_fields.join(', ') : false;
}

utility.IsValidMongoId = function (object_id) {
    const Mongoose = require('mongoose');
    return Mongoose.Types.ObjectId.isValid(object_id)
}




module.exports = utility;

