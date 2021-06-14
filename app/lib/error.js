
/**
 * This file is meant for giving the custom response
 * params @code | @message | @description 
 */

module.exports = function(code,message,description) {
  var error = {};
  error.code = code;
  error.message = message;
  error.description = description;
  return error;
}