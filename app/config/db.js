'use strict';
var mongoose = require('mongoose');
const logger = require('../../logger').logger

//All models schema
__rootRequire("app/api/v1/modules/models/users");

const config = require('./config.js').get(process.env.NODE_ENV);
mongoose.Promise = global.Promise;
mongoose.connect(config.db.url, {useFindAndModify:false, useCreateIndex:true ,useNewUrlParser: true,useUnifiedTopology: true });//SDN Local server
//mongoose.connect("mongodb://orad:6bNdzStVgS43olgUeaVmpsr2G7tCTx3lDhFMRVsCQyrTo11RVN4JGvADfTd2wkxjJL70u6MDFlRK4B5o3m65ig%3D%3D@orad.mongo.cosmos.azure.com:10255/oradFoundation?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@orad@",{useFindAndModify:false, useCreateIndex:true, user: config.db.user, pass: config.db.password ,useNewUrlParser: true,useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, "connection failed"));
db.once('open', function () {
	console.log("Database conencted successfully!");
});
logger.info("Configuring db in mode");
// mongoose.set('debug', true);


