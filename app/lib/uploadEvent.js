const multer = require('multer'),
fs = require('fs'),
constant = require('../../app/lib/constants');


const config = require('../config/config.js').get(process.env.NODE_ENV);

var fileName;
var storage = multer.diskStorage({
	destination: function (request, file, callback) {
		//console.log(request,'request',file,'file');
		//callback(null,  constant.directoryPath.USERIMAGE);
        //callback(null, __basedir + "/resources/static/assets/uploads/");
        callback(null, constant.directoryPath.EVENTIMAGE);
	},
	filename: function (request, file, callback) {
		var time = new Date().getTime();
		console.log("file.name===",file.originalname);
		fileName = time + '_' + file.originalname.slice(file.originalname.lastIndexOf('.') - 1);
		callback(null, fileName);
	}
});
var upload = multer({
	storage: storage
});

function _singleFile(key) {
	// init();
	return upload.single(key);
}

function _fileArray(key, count) {
	// init();
	return upload.array(key, count);
}

const fields = arr => {
	return upload.fields(arr);
}

// ========================== Export Module Start ==========================
module.exports = {
	single: _singleFile,
	array: _fileArray,
	fields
}
// ========================== Export Module End ============================