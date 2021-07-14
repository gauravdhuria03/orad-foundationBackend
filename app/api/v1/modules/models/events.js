'use strict';


const eventsSchema = new mongoose.Schema({

    title: { type: String,default: '' }, 
    overview: { type: String,default: '' }, 
    zoomLink: { type: String,default: '' }, 
    zoomId: { type: String,default: '' },   
    image: { type: String,default: ''  },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'eventcategories'
    }, 
    startDate: { type: Number}, //Unix UTC timestamp of moment
    endDate: { type: Number}, //Unix UTC timestamp of moment
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }, 
    createdAt: { type: Number}, //Unix UTC timestamp of moment
    updatedAt: { type: Number} //Unix UTC timestamp of moment
    
});

var events = mongoose.model('events', eventsSchema);
module.exports = events;

