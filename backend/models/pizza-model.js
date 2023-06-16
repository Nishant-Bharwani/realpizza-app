const mongoose = require('mongoose');
const { BASE_URL } = require('../config');

const { Schema } = mongoose;

const toppingSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
});

const pizzaSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: {
        type: String,
        required: true,
        get: (image) => {
            if (image) {
                return `${BASE_URL}/${image}`
            }

            return image;
        }
    },
    price: { type: Number, required: true },
    category: {
        type: String,
        enum: ['Veg', 'Non-Veg'],
        required: true,
    },
    base: { type: Object },
    sauce: { type: Object },
    cheese: { type: Object },
    veggies: { type: [Object], default: [] },
    meat: { type: [Object], default: [] },
}, { timestamps: true, toJSON: { getters: true } });

module.exports = mongoose.model('Pizza', pizzaSchema, 'pizzas');