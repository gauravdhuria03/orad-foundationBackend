const statusCode = {
    "ok": 200,
    "unauth": 401,
    "notFound": 404,
    "validation": 400,
    "failed": 1002,
    "invalidURL": 1001,
    "paymentReq": 402,
    "internalError": 1004,
    "forbidden": 403,
    "internalservererror": 500,
    "alreadyExist": 409 //conflict
}
const messages = {
    "success":"success",
    "eventupdate":"Event updated successfully",
    "plans_available":"Plans available",
    "save_card": "Card saved successfully",
    "user_busy":"User is already Busy",
    "user_available":"User available",
    "commonError": "Something went wrong",
    'ALREADY_REGISTERD':'Email already register',
    'PHONE_ALREADY_REGISTERD':'Phone number already registered',
    "loginSuccess": "Logged in successfully",
    "accountCreated": "Account Created successfully",
    "signupSuccess": "Signup successfully, please check you email to activate your account",
    "loginOut": "Logout successfully",
    "Registration": "You have successfully registered",
    "recurringDeposit": "You have successfully saved recurring deposit",
    "changePasswordSuccess":"Password changed successfully",
    "registerOverGalileo":"You have successfully registered over galileo",
    "emailAlreadyExist": "Email already exist",
    "requestAccepted": "Request accepted successfully",
    "passwordNotMatch": "Old Password doesn't match",
    "forgotPasswordSuccess": "Reset link send to your email",
    "hospitalWelcomeSuccess": "Welcome mail send to the registered email",
    "createPasswordSuccess": "Password created sucessfully.",
    "validUrl": "Valid Url",
    "invalidUrl": "Invalid Url",
    "userNotFound": "User not found",

}
const resetPassword_message = {
    "key_password_required": "Reset key or password is missing.",
    "reset_token_expire": "Reset password token expires! Regenerate token to set password",
    "password_reset_success": "Password reset successfully.Please try to login."
}
const validateMsg = {
    "internalError": "Internal error",
    "requiredFieldsMissing":"required field are missing",
    "invalidEmail": "Invalid Email Given",
    "invalidUsername": "Invalid Username Given",
    "invalidEmailOrPassword":"Invalid Password Given",
    "accountIsNotActive":"account is not active"
}

const cryptoConfig = {
    "cryptoAlgorithm": "aes-256-ctr",
    "cryptoPassword": '@#DialogflowVoiceBasedBot#@',//'d6F3Efeq',
    "secret": "!@#$PatientEngagement!@#$"//"Test2019",
}
const varibleType = {
    "FORGET_PASSWORD":"Forget Password",
 
}
const emailKeyword = {
    "registration": "registration",
    "forgotPassword": "forgot_password",
 
}
const userTypes = {
    admin: "Admin",
    manager: "Manager"
}
const directoryPath = { 
   // "SERVICEIMAGE": "../backend/app/uploads/",//local
     "USERIMAGE":"../orad-foundationBackend/uploads/images/users/",
     "EVENTIMAGE":"../orad-foundationBackend/uploads/images/events/",
    //"SERVICEIMAGE":"/home/jenkins/workspace/SDN_PatientEngagement/backend/app/uploads/",
    "EXTENSIONS":["docx", "doc", "pdf", "xls","xlsx"],
    "ALLOWED":"docx, doc, pdf, xls,xlsx"
}
const obj = {
    cryptoConfig: cryptoConfig,
    statusCode: statusCode,
    messages:messages,
    validateMsg: validateMsg,
    varibleType:varibleType,
    userTypes:userTypes,
    emailKeyword:emailKeyword,
    directoryPath:directoryPath,
    resetPassword_message:resetPassword_message
};

module.exports = obj;