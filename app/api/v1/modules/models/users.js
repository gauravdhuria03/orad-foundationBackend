'use strict';

const mongoose = require('mongoose');
const constantsObj = require('../../../../lib/constants');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({

    email: { type: String, lowercase: true, unique: true },  //unique: true,
    password: { type: String, default: null },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    userName: { type: String, default: '' },
    mobileNumber: { type: String,default:'' }, 
    dob:{type:String,default:''}, //YYYY-MM-DD    
    gender: { type: String, enum: ['male', 'female']},    
    deviceType: { type: String, default: "web" }, // web,android,iphone
    deviceId: { type: String, default: ''},
    deviceToken:{type: String,default: ''}, //for IOS
    userType: { type: String, default: 'user' }, //user,admin 
    login_history: {
        last_login: {type:Date},
        access_token: {type:String,default:''},
    },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }, 
    createdAt: { type: Number}, //Unix UTC timestamp of moment
    updatedAt: { type: Number} //Unix UTC timestamp of moment
    
});

userSchema.statics.existCheck = function (email, id, callback) {
    var where = {};
    if (id) {
        where = {
            $or: [{ email: new RegExp('^' + email + '$', "i") }], deleted: { $ne: true }, _id: { $ne: id }
        };
    } else {
        where = { $or: [{ email: new RegExp('^' + email + '$', "i") }], deleted: { $ne: true } };
    }
    User.findOne(where, function (err, userdata) {
        if (err) {
            callback(err)
        } else {
            if (userdata) {
                callback(null, constantsObj.validateMsg.emailAlreadyExist);
            } else {
                callback(null, true);
            }
        }
    });
};

userSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var user = mongoose.model('user', userSchema);
module.exports = user;

