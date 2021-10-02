const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const applSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    codeName: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    viewed: {
        type: [String],
    },
    author: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    mentor: {
        type: String,
        required: true
    },
    screenshot: {
        type: String
    },
    download: {
        type: String,
        required: true
    },
    visitor: {
        type: [String],
    },
    category: {
        type: String,
        required: true
    },
    quality: {
        type: String,
        required: true
    },
    comments: {
        type: [String],
    },
}, {
    timestamps: true
});

applSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Application", applSchema);