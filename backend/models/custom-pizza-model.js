const mongoose = require('mongoose');

const { Schema } = mongoose;

const toppingSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
});

const customPizzaSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
        type: String,
        enum: ['Veg', 'Non-Veg'],
        required: true,
    },
    base: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Base',
        required: true
    },
    sauce: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sauce'
    },
    cheese: { type: Object },
    veggies: { type: [Object], default: [] },
}, { timestamps: true, toJSON: { getters: true } });

module.exports = mongoose.model('CustomPizza', customPizzaSchema, 'custompizzas');