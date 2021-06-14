/**
 * This file is meant for giving the custom response
 * params @code | @status | @message | @data | @token
*/

module.exports = function(code,message,data,totalcount) {  
  var response = {};
  response.code = code;
  response.message = message;
  response.data = data;
  response.responseStatus = 0;
  if(data){
    if(data.length > 0){
       response.responseStatus = 1;
    }else if(data.data){
        if(data.data.length > 0){
          response.responseStatus = 1;
        }else{
          response.responseStatus = 0;
        }
    } else{
      response.responseStatus = 0;
    }
  }
  if(totalcount){
    response.totalcount = totalcount ? totalcount : '';
  } 
  return response;
}