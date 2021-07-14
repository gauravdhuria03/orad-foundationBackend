'use strict';


const sponsorshipSchema = new mongoose.Schema({

    companyName: { type: String,default: '' },  
    companyContactName: { type: String, default: null },
    companyPhoneNumber: { type: String, default: null },
    
    email: { type: String, lowercase: true },
    companyWebsite: { type: String, default: '' },
    levelOfSponsership: { type: String,default:'' },
    companyAddress1: { type: String,default:'' }, 
    companyAddress2: { type: String,default:'' }, 
    comment: { type: String,default:'' }, 
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }, 
    createdAt: { type: Number}, //Unix UTC timestamp of moment
    updatedAt: { type: Number} //Unix UTC timestamp of moment
    
});

var sponsorship = mongoose.model('sponsorship', sponsorshipSchema);
module.exports = sponsorship;

