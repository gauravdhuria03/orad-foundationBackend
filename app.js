'use strict';

var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var path = require('path');
var https = require('https');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./app/swagger/swagger.json');
var cors = require('cors');

global.__rootRequire = function(relpath) {
    return require(path.join(__dirname, relpath));
};

var app = express();
app.use(cors());

app.use('/apiDocs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//process.env.NODE_ENV = process.env.NODE_ENV || 'local'; //local server
//process.env.NODE_ENV = process.env.NODE_ENV || 'staging'; //staging servers
process.env.NODE_ENV = process.env.NODE_ENV || 'prod'; //local server

var logger = require('./logger').logger;
const config = require('./app/config/config.js').get(process.env.NODE_ENV);
require('./app/config/db');
const fileUpload = require('express-fileupload');

var utils = require('./app/lib/util')

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
//app.use(fileUpload());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// parse application/x-www-form-urlencoded


// routes
//app.use('/uploads', express.static(path.join(__dirname, './app/uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/modules/dashboard')));
app.use(express.static(path.join(__dirname, 'frontend/dist')));
// All api requests
app.use(function(req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,If-Modified-Since,Authorization,multipart/form-data');
    if (req.headers['type'] === 'Bearer') {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        req.token = token
        req.auth = true
      }
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});



app.use('/api/v1', require('./app/api/v1/routes')(express));
app.use("/", function (req, res) {
    // res.sendFile(path.join(__dirname, './dist/frontend', 'index.html'));
    console.log(__dirname + "/frontend/dist/index.html");    
    res.sendFile(__dirname + "/frontend/dist/index.html");
});
// start server
var port = process.env.PORT || config.port;
// app.listen(port).timeout = 1800000; //30 min
console.log("Available on:", config.backendBaseUrl)
//console.log(config);

// New configuration for ssl

var socketServer
var server;

console.log("app==",app);
if (config.env == 'local') {
    // socketEvents = require('http').createServer();
    server = require('http').createServer(app);
    //  app.set('trust proxy', true)
} else if (config.env == 'staging') {

    const httpsOptions = {
       // cert: fs.readFileSync('/home/jenkins/SSL/mean.crt', 'utf8'),
       // key: fs.readFileSync('/home/jenkins/SSL/mean.key', 'utf8'),
        // cert: fs.readFileSync('/home/jenkins/SSL/meanb.crt', 'utf8'),
    }
    // socketEvents = https.createServer(httpsOptions, app);
    //server = https.createServer(app);
    server = require('http').createServer(app);

    // app.set('trust proxy', true)
}else{
    server = require('http').createServer(app);
}
server.listen(port).timeout = 1800000;


