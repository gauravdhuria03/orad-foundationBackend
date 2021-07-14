'use strict';


const insiderSchema = new mongoose.Schema({

    firstName: { type: String,default: '' },  
    lastName: { type: String, default: null },
    phoneNumber: { type: String, default: null },    
    email: { type: String, lowercase: true },
    jobTitle: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }, 
    createdAt: { type: Number}, //Unix UTC timestamp of moment
    updatedAt: { type: Number} //Unix UTC timestamp of moment
    
});

var insider = mongoose.model('insider', insiderSchema);
module.exports = insider;

