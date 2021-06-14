    var nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport');
    mongoose = require('mongoose'),
    ejs = require('ejs'),
    path = require('path'),
    constant = require('./constants'),

    // EmailTemplate = mongoose.model('emailTemplate');
    EmailTemplate = require('../api/v1/modules/email_template/models/email_template_models');//mongoose.model('emailTemplate');
    const config = require('../config/config.js').get(process.env.NODE_ENV || 'local');

    module.exports = {
        sendMail: sendMail,
        sendMailTO:sendMailTO
    };
    // smtpPort: 587,
    // smtpUser: "aditi.smartdata@gmail.com",
    // smtpPass: "Aditi1391@",
var transporter = nodemailer.createTransport(smtpTransport({
    //service: config.smtp.service,
    //port: 587,
    //secure: true,
    port: 465,
    secure: true,
    host: config.smtp.host,
    //service: 'gmail', 
    auth: {
        user: config.smtp.username,
        pass: config.smtp.password
    },
    tls: {
        rejectUnauthorized: false
    }
}));


function sendMailTO(to, userData) {
    async function sendMailTO() {
      var mailOptions = {
        from: "shahnaddy@gmail.com",
        to: to,
        subject: userData.subject,
        text: userData.message
      };
  
      transporter.sendMailTO(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
  
    sendMailTO().then(function() {});
  }

 function sendMail(to, keyword, userData, callbackMail) {
     async function sendMail(){ 
         let mailContent;
         let subject;  
         console.log("userData==",userData)

         if(keyword==constant.emailKeyword.forgotPassword) {    
         mailContent =  `<p>Hi  ${userData.firstName} ,</p>
          <p>Forgot your password? Not to worry, let's get you a new one:</p> 
          <p>Reset Password</p> <a href=${userData.newpasswordlink} >Click here to change password</a>
          <p>If you have not requested this password change, please email us at info@senteFintech.com</p>
          <p>Regards,</p>
          <p>The Sente Fintech team</p>
          <p><img height="100" src=${config.baseUrl+'/assets/images/sente/logo.png'} /></p>`;
          subject='Change password';
         }
                if( userData.adminEmail){
                    to = userData.adminEmail
                }
                else{
                    to = to
                }
                // console.log("\n\n\n\nelse 2222222222", to);
                //replacePlaceholders(userData, template.description, template.subject, function (mailContent, subject) {
                    var options = { mailbody: mailContent }
                    generateTemplate(options, function (mailContent) {
                        
                        var mailOptions = {
                            from: config.smtp.mailUsername,//config.smtp.mailUsername, // sender address
                            to: to, // list of receivers
                            subject: subject, // Subject line
                            html: mailContent // Mail content body 
                        };
     
                        if(config.env == 'local' || config.env == 'staging'){
                            //local and staging
                            console.log("mailer",config.env ,mailOptions)
                            transporter.sendMail(mailOptions, function (error, info) { // send mail with defined transport object
                                if (error) {
                            console.log("error",error)

                                    callbackMail(error, null);
                                } else {
                            console.log("sent")
                                    
                                    var returnMsg = 'Mail sent successfully';
                                    callbackMail(null, { message: returnMsg });
                                }
                            });
                        }
                        else{
                        //Live
                            const params = {
                                Destination: {
                                    ToAddresses: [to]
                                },
                                Message: {
                                    Body: {
                                        Html: {
                                            Charset: 'UTF-8',
                                            Data: mailOptions.html
                                        }
                                    },
                                    Subject: {
                                        Charset: 'UTF-8',
                                        Data: mailOptions.subject
                                    }
                                },
                                ReturnPath: config.aws_ses.fromName,
                                Source: config.aws_ses.fromName
                            }
     
                            ses.sendEmail(params, (err, data) => {
                                if (err) {
                                    callbackMail(err,null);
                                } else {
                                    
                                    var returnMsg = 'Mail sent successfully';
                                    callbackMail(null, { message: returnMsg });
                                }
                            })
                        }
                    });
                //})
            
        
 }
 sendMail();
}

var generateTemplate = function (options, callbackg) {
    var recepient = options.recepient || '',
        mailbody = options.mailbody;

    var fileName = path.resolve('./api/lib/mailTemplate.html');
    ejs.renderFile(fileName, { recepient: recepient, mailbody: mailbody }, {}, function (err, str) {
        if (err) {
            callbackg(mailbody);
        } else {
            callbackg(str || mailbody);
        }
    });
}

var currYear = new Date().getFullYear();
var MDoutUrl = config.baseUrl

var replacePlaceholders = function (data, mailbody, subj, callbackr) {
    var content = mailbody.replace(/\[\[(.*?)\]\]/g, function (match, token) {
        switch (token) {
            case 'BASEURL':
                return config.baseUrl;
                break;
            case 'FirstName':
                return data.firstName.charAt(0).toUpperCase() + data.firstName.slice(1).toLowerCase() ? data.firstName.charAt(0).toUpperCase() + data.firstName.slice(1).toLowerCase() : '';
                break;
            case 'LastName':
                return data.lastName.charAt(0).toUpperCase() + data.lastName.slice(1).toLowerCase();
                break;
            case 'Username':
                return data.userName.charAt(0).toUpperCase() + data.userName.slice(1).toLowerCase() ? data.userName.charAt(0).toUpperCase() + data.userName.slice(1).toLowerCase() : '';
                break;
            case 'Password':
                return data.password;
                break;
                case 'UniquePatientId':
                    return data.uniquePatientId;
                    break;    
            case 'Email':
                return data.email;
                break;
            case 'verifingLink':
                return "<a style ='border-bottom:1px solid #d7d7d7;font-size: 16px;background:#028dd8;color:#fff;text-align:center;padding: 10px 20px 7px;font-weight:normal;display: inline-block;margin: 10px 0;text-decoration: none;' href='" + data.verifingLink + "' target='_blank'>Verify Email Address</a>";
                break;
            case 'loginLink':
                return "<a style ='border-bottom:1px solid #d7d7d7;font-size: 16px;background:#028dd8;color:#fff;text-align:center;padding: 10px 20px 7px;font-weight:normal;display: inline-block;margin: 10px 0;text-decoration: none;' href='" + data.loginLink + "' target='_blank'>Check newly added content</a>";
                break;
            case 'assignSurveyLink':
                return "<a style ='border-bottom:1px solid #d7d7d7;font-size: 16px;background:#028dd8;color:#fff;text-align:center;padding: 10px 20px 7px;font-weight:normal;display: inline-block;margin: 10px 0;text-decoration: none;' href='" + data.assignSurveyLink + "' target='_blank'>Click Here To Start</a>";                
                break;
            case 'Link':
                return data.link
                break;
            case 'SenderName':
                return data.senderName;
                break;
            case 'MDoutUrl':
                return MDoutUrl;
                break;
            case 'currYear':
                return currYear;
                break;
            case 'Password':
                return data.password;
                break;
            case 'Name':
                return data.name;
                break;
            case 'MessageBody':
                return data.message;
                break;
            case 'SurveyName':
                return data.surveyName;
                break;
            case 'ClinicName':
                return data.clinicName;
                break;
            case 'PhoneNumber':
                return data.phoneNumber;
                break;
            case 'ClinicEmail':
                return data.clinicEmail;
                break;
            case 'ClinicLogo':
                return data.clinicLogo;
                break;
            case 'BackendBASEURL':
                return config.backendBaseUrl;
                break;
            case 'physicianName':
                return data.physicianName;
                break;
            case 'patientName':
                return data.patientName;
                break;
            case 'appointMentDate':
                return data.appointMentDate;
                break;
            case 'startTime':
                return data.startTime;
                break;
            case 'endTime':
                return data.endTime;
                break;
            case 'URL':
                return data.url;
                break;
            case 'contenet':
                return data.contenet;
                break;
            case 'CouponCode':
                return data.coupon_code;
                break;
            case 'Lawfirm':
                return  data.lawfirm.charAt(0).toUpperCase() + data.lawfirm.slice(1).toLowerCase();
                break;
            case 'NewPasswordLink':
                return  data.newpasswordlink;
                break;
                case 'LoginLink':
                    return  data.loginlink;
                    break;
                
        }
    })
    var subject = subj.replace(/\[\[(.*?)\]\]/g, function (match1, token1) {
        switch (token1) {
            case 'ReceiverFname':
                return data.firstName;
                break;
            case 'ReceiverLname':
                return data.lastName
                break;
        }
    })
    if (content && subject) {
        callbackr(content, subject);
    }
}
