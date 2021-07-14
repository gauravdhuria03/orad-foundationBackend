'use strict';


const eventsCategoriesSchema = new mongoose.Schema({

    name: { type: String,default: '' },      
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }, 
    createdAt: { type: Number}, //Unix UTC timestamp of moment
    updatedAt: { type: Number} //Unix UTC timestamp of moment
    
});

var eventscategories = mongoose.model('eventscategories', eventsCategoriesSchema);
module.exports = eventscategories;

