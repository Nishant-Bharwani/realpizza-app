const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer'
    },
    resetToken: String,
    resetTokenExpiry: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema, 'users');