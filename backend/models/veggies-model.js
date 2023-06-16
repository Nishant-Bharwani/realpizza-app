const mongoose = require('mongoose');

const veggiesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
}, { timestamps: true });

const Veggies = mongoose.model('Veggie', veggiesSchema);

module.exports = Veggies;