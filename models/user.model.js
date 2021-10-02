const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const {
    isEmail
} = require('validator');

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        validate: [isEmail],
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);