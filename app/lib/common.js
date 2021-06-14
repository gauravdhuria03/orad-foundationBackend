'use strict';
var AWS = require('aws-sdk');
//var service_url = require('./index.js');
const { Storage } = require('@google-cloud/storage');

var path = require('path');
const config = require('../config/config.js').get(process.env.NODE_ENV);
let async = require("async");
var fs = require('fs'),

url = require('url');

const bucketName = "voicebased";
const storage = new Storage({
    projectId: "speech-to-text-272805",
    keyFilename: path.join(__dirname, 'speech to text-64cdd51ef8c2.json')
    //keyFilename: "./app/lib/speech to text-64cdd51ef8c2.json",
});

module.exports = {
    uploadFile: uploadFile,
    formatDate:formatDate
};

function uploadFile(file) {
    async function uploadFile() {
        console.log("cloud files++++++++++", "bucket============", bucketName)

        //const filePath ="./app/uploads/money.jpg"//uploads/SampleVideo_1280x720_1mb.mp4// "./uploads/"  + "" + file.video.name;
        //const filePath = "./app/uploads/" + "" + file.video.name
        //const filePath = "/home/jenkins/workspace/SDN_PatientEngagement/backend/app/uploads/" + "" + file.video.name
        //    let dynamicPath = '../uploads/' + file.video.name
        //    const filePath = path.join(__dirname, dynamicPath)
        const filePath = file.path
        console.log("filepath====", filePath);
        await storage.bucket(bucketName).upload(filePath, {

            // Support for HTTP requests made with `Accept-Encoding: gzip
            gzip: true,
            // destination: "audio/"+Date.now()+"_"+path.basename(filePath),
            destination: "video/" + path.basename(filePath),//Date.now()+"_"+path.basename(filePath),
            // By setting the option `destination`, you can change the name of the
            // object you are uploading to a bucket.
            metadata: {
                // Enable long-lived HTTP caching headers
                // Use only if the contents of the file will never change
                // (If the contents will change, use cacheControl: 'no-cache')
                cacheControl: 'public, max-age=31536000',
            },
        });

        console.log(`${filePath} uploaded to ${bucketName}.`);
    }

    uploadFile().catch(console.error);
}

 

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}
