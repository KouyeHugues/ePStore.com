const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const commentSchema = mongoose.Schema({
    commentPseudo: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

commentSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Comment", commentSchema);