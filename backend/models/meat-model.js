const mongoose = require('mongoose');

const meatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Meat = mongoose.model('Meat', meatSchema);

module.exports = Meat;