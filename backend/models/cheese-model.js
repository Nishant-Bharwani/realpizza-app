const mongoose = require('mongoose');

const cheeseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Cheese = mongoose.model('Cheese', cheeseSchema);

module.exports = Cheese;