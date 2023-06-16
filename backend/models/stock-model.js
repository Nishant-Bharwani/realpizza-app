const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
    base: [{
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            default: 0
        }
    }],
    sauce: [{
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            default: 0
        }
    }],
    cheese: [{
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            default: 0
        }
    }],
    veggies: [{
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            default: 0
        }
    }],
    meat: [{
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            default: 0
        }
    }]
});

const Stock = mongoose.model('Stock', StockSchema, 'stock');

module.exports = Stock;