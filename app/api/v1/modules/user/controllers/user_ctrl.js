'use strict';

const util = require('util'),
    validator = require('../../../../../../app/lib/validator'),
    jwt = require('jsonwebtoken'),
    unirest = require("unirest"),
    fs = require('fs'),
    moment = require('moment'),
    utility = require('../../../../../../app/lib/utility.js'),
    Error = require('../../../../../../app/lib/error.js'),
    Response = require('../../../../../../app/lib/response.js'),
    constant = require('../../../../../../app/lib/constants'),    
    query = require('../../../../../../app/lib/common_query'),
    common = require('../../../../../../app/lib/common'),
    User = require('../../models/users');
   


module.exports = {
    UserRegistration: UserRegistration,   
    login: login,
    adminlogin:adminlogin,
    forgotPassword: forgotPassword,
    userLogout: userLogout,
    resetPassword: resetPassword,
    changePassword: changePassword,    
    updateDeviceToken: updateDeviceToken,
    updateUserImage: updateUserImage,
    updateProfile: updateProfile,
    usersList:usersList,
    getUserDetails:getUserDetails,
    updateProfileFromBackend:updateProfileFromBackend
   
};


/**
 * user logout 
 * @access private
 * @return json
 * Created by sukhdev singh
 * 
 * Created Date 4-April-2021
 */
 function userLogout(req, res) {
    async function userLogoutMethod() {
        try {
            let userId = req.headers.decoded.userId;
            let userLoginDetails = query.updateOneDocument(User, { _id: userId }, { login_history: { last_login: '', access_token: '' } });

            // Add logout finction here & send response
            return res.json(Response(constant.statusCode.ok, constant.messages.loginOut));
        }
        catch (error) {
            return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.internalError, error));
        }
    }
    userLogoutMethod().then(function (data) {
    });
    
};


/**
 * getUserDetails API 
 * @access private
 * @return json
 * Created by sukhdev singh
 * Created Date 19-06-2021
 */

 function getUserDetails(req, res) {
    
    console.log(req.body.user_id, 'req.body.user_id');
    async function getUserDetails() {
        try {
            let Condition = {
                _id: mongoose.Types.ObjectId(req.params.id)
            }
            console.log(Condition, 'Condition');
            let UserData = await query.findoneData(User, Condition);
            
        
            if (UserData.status == true && UserData.data) {
                return res.json(Response(200, constant.messages.user_available, UserData.data));
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
    getUserDetails().then(function (data) { });
}




/**
 * Function is use to change password
 * @access private
 * @return json
 * Created by sukhdev singh
 * 
 * Created Date 01-April-2021
 */
function changePassword(req, res) {

    async function changePasswordMethod() {
        let userId = req.headers.decoded.userId;

        if (userId && req.body.oldPassword && req.body.newPassword) {

            let cond = {
                _id: userId
            }
            console.log("cond==", cond);
            try {
                var result = await query.findoneData(User, cond);
                //console.log("result==",result);
                if (result.status) {
                    if (result.data != null) {
                        result.data.comparePassword(req.body.oldPassword, function (err, isMatch) {
                            if (err) {
                                console.log("err==", err);
                                return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.internalError));
                            } else if (isMatch) {
                                result.data.comparePassword(req.body.newPassword, async (err, checkMatch) => {
                                    if (err) {
                                        console.log("err==", err);
                                        return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.internalError));
                                    } else if (checkMatch) {
                                        console.log("checkMatch==", checkMatch);
                                        return res.json(Response(constant.statusCode.unauth, constant.messages.passwordNotMatch));
                                    } else {
                                        let hashValue = await query.saltThePassword(req.body.newPassword);
                                        if (hashValue.status) {
                                            let finalResult = await query.updateOneDocument(User, cond, { password: hashValue.value });
                                            if (!finalResult.status) {
                                                return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.internalError, finalResult.error));
                                            }
                                            else {
                                                return res.json(Response(constant.statusCode.ok, constant.messages.changePasswordSuccess, finalResult.data));
                                            }
                                        } else {
                                            return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.internalError));
                                        }
                                    }
                                })
                            } else {
                                console.log("eerrror==");
                                return res.json(Response(constant.statusCode.unauth, constant.messages.passwordNotMatch));
                            }
                        })
                    } else {
                        return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.userNotFound));
                    }
                } else {
                    return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.internalError));
                }
            } catch (error) {
                console.log("error===", error);
                return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.internalError));
            }

        } else {

            return res.json(Response(constant.statusCode.unauth, constant.validateMsg.requiredFieldsMissing));
        }
    }
    changePasswordMethod().then(function (data) { });
}


/**
 *  update user default image
 * @access private
 * @return json
 * Created by Sukhdev Singh
 * 
 * Created Date 5-April-2021
 */
function updateUserImage(req, res) {
    let userId = req.headers.decoded.userId;

    console.log("req body---------", req.file);
    // console.log("req============", req.files);
    // console.log("req============filename", req.files);
    async function updateUserImage() {
        try {
            let cond = {
                _id: userId
            }

            let filename = req.file.filename;
            let path = '/uploads/images/users/' + "" + filename;
            var userObj = {
                image: path
            }
            let finalResult = await query.updateOneDocument(User, cond, userObj);
            if (!finalResult.status) {
                return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.internalError, finalResult.error));
            }
            else {
                let findDataGalieloCond = {
                    userId: userId
                }
                let userGalileoPlaidData = await query.findoneData(Galileo, findDataGalieloCond);
                finalResult.data.image = path;
                let finalObjectToBeSend = {
                    userInfo: finalResult.data,
                    userGalileoPlaidData: userGalileoPlaidData.data,
                }
                finalResult.data.deviceToken = req.body.deviceToken;
                return res.json(Response(constant.statusCode.ok, constant.statusCode.profileUpdated, finalObjectToBeSend));
            }
        } catch (err) {
            res.status(500).send({
                message: `Could not upload the file: ${req.image.name}. ${err}`,
            });
        }
    }
    updateUserImage().then(function (data) {
    });
}
/**
 *  Update user basic info
 * @access private
 * @return json
 * Created by Gaurav
 * 
 * Created Date 15-06-2021
 */
function updateProfile(req, res) {
    let userId = req.headers.decoded.userId;
    console.log("userId====", userId);
    async function updateProfile() {
        try {
            let cond = {
                _id: userId
            }
            var userObj = {
                firstName: req.body.firstName ? req.body.firstName : '',
                lastName: req.body.lastName ? req.body.lastName : ''
            }
            let finalResult = await query.updateOneDocument(User, cond, userObj);
            if (!finalResult.status) {
                return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.internalError, finalResult.error));
            }
            else {
                
                finalResult.data.firstName = req.body.firstName;
                finalResult.data.lastName = req.body.lastName;
              
                finalResult.data.deviceToken = req.body.deviceToken;
                return res.json(Response(constant.statusCode.ok, constant.statusCode.profileUpdated, finalResult.data));
            }

        } catch (error) {
            console.log(error);
            return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.internalError));
        }
    }
    updateProfile().then(function (data) {
    });
}
/**
 *  Update user basic info from backend
 * @access private
 * @return json
 * Created by Gaurav
 * 
 * Created Date 15-06-2021
 */
 function updateProfileFromBackend(req, res) {
    let userId = req.body.userId;
    console.log("userId====", userId);
    async function updateProfileFromBackend() {
        try {
            let cond = {
                _id: userId
            }
            var userObj = {
                firstName: req.body.firstName ? req.body.firstName : '',
                lastName: req.body.lastName ? req.body.lastName : '',
                street: req.body.street ? req.body.street : '',
                city: req.body.city ? req.body.city : '',
                state: req.body.state ? req.body.state : '',
                country: req.body.country ? req.body.country : '',
                postalCode: req.body.postalCode ? req.body.postalCode : ''
                
            }
            let finalResult = await query.updateOneDocument(User, cond, userObj);
            if (!finalResult.status) {
                return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.internalError, finalResult.error));
            }
            else {
                
                finalResult.data.firstName = req.body.firstName;
                finalResult.data.lastName = req.body.lastName;
                finalResult.data.street = req.body.street;
                finalResult.data.city = req.body.city;
                finalResult.data.state = req.body.state;
                finalResult.data.country = req.body.country;
                finalResult.data.postalCode = req.body.postalCode;
              
                
                return res.json(Response(constant.statusCode.ok, constant.statusCode.profileUpdated, finalResult.data));
            }

        } catch (error) {
            console.log(error);
            return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.internalError));
        }
    }
    updateProfileFromBackend().then(function (data) {
    });
}
/**
 *  Update Device token of user 
 * @access private
 * @return json
 * Created by Sukhdev Singh
 * 
 * Created Date 4-April-2021
 */
function updateDeviceToken(req, res) {
    let userId = req.headers.decoded.userId;
    async function updateDeviceToken() {
        try {
            let cond = {
                _id: userId
            }
            var userObj = {
                deviceToken: req.body.deviceToken ? req.body.deviceToken : '',
            }
            console.log("userObj==", userObj);
            let finalResult = await query.updateOneDocument(User, cond, userObj);
            if (!finalResult.status) {
                return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.internalError, finalResult.error));
            }
            else {
                finalResult.data.deviceToken = req.body.deviceToken;
                return res.json(Response(constant.statusCode.ok, constant.statusCode.profileUpdated, finalResult.data));
            }

        } catch (error) {
            console.log(error);
            return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.internalError));
        }
    }
    updateDeviceToken().then(function (data) { });
}

/**
 * Function is use to admin login 
 * @access private
 * @return json
 * Created by Gaurav dhuria
 * 
 * Created Date 18-mar-2021
 */
 function adminlogin(req, res) {
    console.log("admin login request===============================", req.body)
    async function adminlogin() {
        try {
            let finalObjectToBeSend = {};
            let jwtToken = null;
            let findDataCondition =
            {
                userName: req.body.userName,
                userType: 'admin',
                isDeleted: false
            }
            let findUserDetails = await query.findoneData(User, findDataCondition);
            // console.log("findUserDetailsfindUserDetails", findUserDetails)
            if (findUserDetails.status) {
                if (findUserDetails.data && findUserDetails.data.isActive) {
                    findUserDetails.data.comparePassword(req.body.password, async function (err, isMatch) {
                        if (err) {
                            return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.invalidEmailOrPassword));
                        }
                        else if (isMatch) {
                            let params = {
                                userId: findUserDetails.data._id,
                                mobileNumber: findUserDetails.data.mobileNumber,
                                email: findUserDetails.data.email,
                                userType: findUserDetails.data.userType
                            }
                            let expirationDuration = 60 * 60 * 24 * 15; // expiration duration format sec:min:hour:day. ie: 8 Hours as per i/p
                            jwtToken = jwt.sign(params, constant.cryptoConfig.secret, {
                                expiresIn: expirationDuration
                            });
                            delete findUserDetails.data['password'];
                            findUserDetails.data.login_history = { last_login: Date.now(), access_token: jwtToken };
                            let userLoginDetails = query.updateOneDocument(User, { _id: findUserDetails.data._id }, { login_history: { last_login: Date.now(), access_token: jwtToken } });
                           
                            let finalObjectToBeSend = {
                                userInfo: findUserDetails.data
                            }

                            if (finalObjectToBeSend) {
                                return res.json(Response(constant.statusCode.ok, constant.messages.loginSuccess, finalObjectToBeSend));
                            }
                        }
                        else {
                            return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.invalidEmailOrPassword));
                        }
                    });
                } else if (findUserDetails.data && !findUserDetails.data.isActive) {
                    return res.json(Response(constant.statusCode.forbidden, constant.validateMsg.accountIsNotActive));
                }
                else {
                    return res.json(Response(constant.statusCode.unauth, constant.validateMsg.invalidUsername));
                }
            }
            else {
                return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.internalError));
            }

        }
        catch (error) {
            console.log("errors========", error);
            return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.internalError, error));
        }
    }
    adminlogin().then(function (data) {
    })
}


/**
 * Function is use to login by user
 * @access private
 * @return json
 * Created by sukhdev singh
 * 
 * Created Date 18-mar-2021
 */
function login(req, res) {
    console.log("login request===============================", req.body)
    async function loginMethod() {
        try {
            let finalObjectToBeSend = {};
            let jwtToken = null;
            let findDataCondition =
            {
                email: req.body.email,
                isDeleted: false
            }
            let findUserDetails = await query.findoneData(User, findDataCondition);
            // console.log("findUserDetailsfindUserDetails", findUserDetails)
            if (findUserDetails.status) {
                if (findUserDetails.data && findUserDetails.data.isActive) {
                    findUserDetails.data.comparePassword(req.body.password, async function (err, isMatch) {
                        if (err) {
                            return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.invalidEmailOrPassword));
                        }
                        else if (isMatch) {
                            let params = {
                                userId: findUserDetails.data._id,
                                mobileNumber: findUserDetails.data.mobileNumber,
                                email: findUserDetails.data.email,
                                userType: findUserDetails.data.userType
                            }
                            let expirationDuration = 60 * 60 * 24 * 15; // expiration duration format sec:min:hour:day. ie: 8 Hours as per i/p
                            jwtToken = jwt.sign(params, constant.cryptoConfig.secret, {
                                expiresIn: expirationDuration
                            });
                            delete findUserDetails.data['password'];
                            findUserDetails.data.login_history = { last_login: Date.now(), access_token: jwtToken };
                            let userLoginDetails = query.updateOneDocument(User, { _id: findUserDetails.data._id }, { login_history: { last_login: Date.now(), access_token: jwtToken } });
                           
                            let finalObjectToBeSend = {
                                userInfo: findUserDetails.data
                            }

                            if (finalObjectToBeSend) {
                                return res.json(Response(constant.statusCode.ok, constant.messages.loginSuccess, finalObjectToBeSend));
                            }
                        }
                        else {
                            return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.invalidEmailOrPassword));
                        }
                    });
                } else if (findUserDetails.data && !findUserDetails.data.isActive) {
                    return res.json(Response(constant.statusCode.forbidden, constant.validateMsg.accountIsNotActive));
                }
                else {
                    return res.json(Response(constant.statusCode.unauth, constant.messages.invalidUserNameOrPwd));
                }
            }
            else {
                return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.internalError));
            }

        }
        catch (error) {
            console.log("errors========", error);
            return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.internalError, error));
        }
    }
    loginMethod().then(function (data) {
    })
}



/**
 * Forgot passsword
 * @access private
 * @return json
 * Created by sukhdev singh
 * 
 * Created Date  08-Mar-2021
 */
function forgotPassword(req, res) {
    async function forgot_password() {
        try {
            if (!req.body.email) {
                res.json(
                    Error(
                        constant.statusCode.error,
                        constant.validateMsg.requiredFieldsMissing,
                        constant.validateMsg.requiredFieldsMissing
                    )
                );
            } else if (req.body.email && !validator.isEmail(req.body.email)) {
                res.json(
                    Error(
                        constant.statusCode.error,
                        constant.validateMsg.invalidEmail,
                        constant.validateMsg.invalidEmail
                    )
                );
            } else {
                var model = User;
                var condition = {
                    email: req.body.email,
                    isDeleted: false
                };
                var userObj = await query.findoneData(model, condition);
                // console.log("userObjuserObj++++++++", userObj)
                if (userObj.data) {
                    var condition = {
                        _id: userObj.data._id
                    };
                    var updateData = {
                        resetkey: ''
                    }
                    updateData.resetkey = utility.uuid.v1();
                    console.log("data for resetkey updateData", updateData);

                    let updateKey = await query.updateOneDocument(model, condition, updateData);
                    if (updateKey.data._id) {
                        var baseUrl = config.baseUrl;
                        var userMailData = {
                            userId: userObj.data._id,
                            email: userObj.data.email ? userObj.data.email : '',
                            firstName: userObj.data.firstName ? userObj.data.firstName : '',
                            lastName: userObj.data.lastName ? userObj.data.lastName : '',
                            userName: userObj.data.userName ? userObj.data.userName : '',
                            link: baseUrl + '/create-password/' + updateKey.data.resetkey,
                        };
                        let obj = {
                            data: userMailData,
                            mailType: constant.varibleType.FORGET_PASSWORD,  //"Forget Password"
                        }
                        // console.log("data for forget password========", obj)
                        let sendMail = await query.sendEmailFunction(obj);
                        if (sendMail) {
                            console.log("sendMailsendMail==========")
                            res.json(
                                Response(
                                    constant.statusCode.ok,
                                    constant.messages.forgotPasswordSuccess
                                )
                            );
                        }
                        else {
                            res.json(
                                Response(
                                    constant.statusCode.internalservererror,
                                    constant.validateMsg.internalError
                                )
                            );
                        }

                    }
                } else {
                    res.json(
                        Response(
                            constant.statusCode.notFound,
                            constant.validateMsg.emailNotExist
                        )
                    );
                }

            }
        } catch (error) {
            return res.json(Response(constant.statusCode.notFound, constant.validateMsg.notificationNotSent));
        }
    };
    forgot_password().then((data) => {
    });

}


/**
 * reset passsword
 * @access private
 * @return json
 * Created by Gaurav Dhuria
 * 
 * Created Date 12-06-2021
 */
function resetPassword(req, res) {
    async function reset_password() {
        try {
            if (req.body.password == '' || req.body.resetkey == '') {
                res.json(
                    Error(
                        constant.statusCode.error,
                        constant.resetPassword_message.key_password_required
                    )
                );
            } else {
                var model = User;
                var condition = { resetkey: req.body.resetkey };
                var userObj = await query.findoneData(model, condition);
                var userData = userObj.data;
                console.log("userData==",userData);
                if (userData._id) {
                    console.log("req.body.password==", req.body.password);
                    userData.password = req.body.password;
                    userData.resetkey = '';
                    console.log("userData", userData)
                    // userData.save(function (err, data) {
                    userData.save(async function (err, userData) {
                        console.log("data", userData)
                        if (err) {
                            res.json(
                                Error(
                                    constant.statusCode.error,
                                    err
                                )
                            );
                        } else {
                            res.json(
                                Response(
                                    constant.statusCode.ok,
                                    constant.resetPassword_message.password_reset_success,
                                    {}, null
                                )
                            );
                        }
                    })
                } else {
                    res.json(
                        Response(
                            constant.statusCode.ok,
                            constant.resetPassword_message.reset_token_expire,
                            {}, null
                        )
                    );
                }
            }
        } catch (error) {
            console.log("error",error);
            return res.json(Response(constant.statusCode.notFound, constant.validateMsg.notificationNotSent));
        }
    }
    reset_password().then((data) => {

    })
}


/**
 * Registion of User 
 * @access private
 * @return json
 * Created by Gaurav Dhuria
 * Created Date  12-6-2021
 */

function UserRegistration(req, res) {
    async function UserRegistration() {
        try {
            var body = req.body;
            if (!validator.isValid(body.firstName) || !validator.isValid(body.email) || !validator.isValid(body.password)) {
                res.json({
                    'code': constant.statusCode.unauth,
                    'message': constant.validateMsg.requiredFieldsMissing
                });
            }
            else {
                let cond = {
                    email: body.email,
                    isDeleted: false
                }
                // let Userdata = await query.findoneData(Role,{ name: 'Manager', isDeleted: false });
                let Userdata = await query.findoneData(User, cond);

                if (Userdata.data != null) {
                    res.json({
                        'code': constant.statusCode.alreadyExist,
                        'message': constant.messages.emailAlreadyExist

                    });
                }
                else {
                    if (Userdata.data == null) {
                        // console.log("Userdata================", Userdata)
                        console.log("email not match");

                        let firstName = req.body.firstName ? req.body.firstName : ''
                        let lastName = req.body.lastName ? req.body.lastName : '';
                        let userName = firstName + ' ' + lastName;
                        var dob = req.body.dob ? common.formatDate(req.body.dob) : '';  // dateStr you get from mongodb
                        var userObj = {
                            firstName: req.body.firstName ? req.body.firstName : '',
                            lastName: req.body.lastName ? req.body.lastName : '',
                            userName: req.body.userName ? req.body.userName : userName,
                            email: req.body.email ? req.body.email.trim().toLowerCase() : '',
                            password: req.body.password ? req.body.password : '',
                            mobileNumber: req.body.mobileNumber ? req.body.mobileNumber : '',                          
                            gender: 'male',                          
                            updatedAt: moment().unix(),
                            createdAt: moment().unix()
                        };
                    
                        var saveObj = await query.uniqueInsertIntoCollection(User, userObj);
                        if (!saveObj.status) {
                            return res.json(Response(constant.statusCode.internalservererror, constant.validateMsg.internalError, saveObj.err));
                        } else {
                            let jwtToken = null;
                            let params = {
                                userId: saveObj.userData._id,
                                mobileNumber: saveObj.userData.mobileNumber,
                                email: saveObj.userData.email,
                                userType: saveObj.userData.userType
                            }
                            let expirationDuration = 60 * 60 * 24 * 15; // expiration duration format sec:min:hour:day. ie: 8 Hours as per i/p
                            jwtToken = jwt.sign(params, constant.cryptoConfig.secret, {
                                expiresIn: expirationDuration
                            });
                            let userLoginDetails = query.updateOneDocument(User, { _id: saveObj.userData._id }, { login_history: { last_login: Date.now(), access_token: jwtToken } });
                            saveObj.userData.login_history = { last_login: Date.now(), access_token: jwtToken }
                            delete saveObj.userData['password'];

                            let finalDataTosend = {
                                userInfo: saveObj.userData
                                
                            }                                               

                            res.json({
                                code: constant.statusCode.ok,//200,
                                message: constant.messages.Registration,
                                data: finalDataTosend
                            })
                        }
                    }
                }
            }
        } catch (error) {
            console.log("error", error);
            return res.json(Response(constant.statusCode.notFound));

        }
    }
    UserRegistration().then(function (data) { })
}


/**
 * Get registered users list 
 * @access private
 * @return json
 * Created by Gaurav Dhuria
 * Created Date  19-6-2021
 */

 function usersList(req, res) {
    async function usersList() {
        try {
            
                let cond = {
                    userType:'user',
                    isDeleted: false
                }
                // let Userdata = await query.findoneData(Role,{ name: 'Manager', isDeleted: false });
                let Userdata = await query.fetch_all(User, cond);

                                                         

                    res.json({
                        code: constant.statusCode.ok,//200,
                        message: constant.messages.Registration,
                        data: Userdata
                    })
            } catch (error) {
                console.log("error", error);
                return res.json(Response(constant.statusCode.notFound));

            }
    }
    usersList().then(function (data) { })
}


