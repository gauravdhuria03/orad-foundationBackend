'use strict';

var mongoose = require('mongoose');

var emailTemplateSchema = new mongoose.Schema({
    title: { type: String },
    unique_keyword: { type: String },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    created_by_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
    }, {
        timestamps: true
    });

module.exports = mongoose.model('emailTemplate', emailTemplateSchema);