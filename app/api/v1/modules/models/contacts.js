'use strict';


const ContactsSchema = new mongoose.Schema({

    userName: { type: String,default: '' },  
    cellPhone: { type: String, default: null },
    email: { type: String, lowercase: true },
    subject: { type: String, default: '' },
    message: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }, 
    createdAt: { type: Number}, //Unix UTC timestamp of moment
    updatedAt: { type: Number} //Unix UTC timestamp of moment
    
});

var contacts = mongoose.model('contact', ContactsSchema);
module.exports = contacts;

