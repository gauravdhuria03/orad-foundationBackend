'use strict';
// var jwt = require('jsonwebtoken'),
//     constant = require('./constants');
var jwt = require('jsonwebtoken'),
    constant = require('./constants');
const jwtKey = '!@#$PatientEngagement!@#$';//'Test2019'
const multer = require('../lib/multer');
var allowed = [
    '/user/userRegister',
    '/user/verifyAccount',
    '/user/userLogin',
    '/user/forgotPassword',
    '/user/resetPassword',
];

module.exports = {
    ensureAuthorized: ensureAuthorized,
    multer
}
function ensureAuthorized(req, res, next) {
  var bearerToken;
  var bearerHeader = req.headers["authorization"];
  if (bearerHeader !== "undefined") {
     console.log("BEARER HEADER", bearerHeader);
    var bearer = bearerHeader.split(" ")//bearerHeader; //bearerHeader.split(" ");

     console.log("sss", bearer[1]);
    bearerToken = bearer[1];
     console.log("SSSSS", bearerToken);
    jwt.verify(bearerToken, jwtKey, function(err, decoded) {
      // console.log("decoded ================= ", err, decoded);
      req.user = decoded;
      if (err) {
        return res.send({
          code: 400,//Constant.AUTH_CODE,
          message: 'Invalid token'//Constant.INVALID_TOKEN
        });
      }
      next();
    });
  } else {
    return res.send({
      code: 400,//Constant.AUTH_CODE,
      message: 'Token error'//Constant.TOKEN_ERROR
    });
  }
}

