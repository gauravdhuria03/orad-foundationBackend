'use strict';
var mongoose = require('mongoose');
const logger = require('../../logger').logger

//All models schema
__rootRequire("app/api/v1/modules/models/users");

const config = require('./config.js').get(process.env.NODE_ENV);
mongoose.Promise = global.Promise;
mongoose.connect(config.db.url, {useFindAndModify:false, useCreateIndex:true, user: config.db.user, pass: config.db.password ,useNewUrlParser: true,useUnifiedTopology: true });//SDN Local server
var db = mongoose.connection;
db.on('error', console.error.bind(console, "connection failed"));
db.once('open', function () {
	console.log("Database conencted successfully!");
});
logger.info("Configuring db in mode");
// mongoose.set('debug', true);



