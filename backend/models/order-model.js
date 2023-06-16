const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    orderId: { type: String, required: true, unique: true },
    pizzas: [{
        pizza: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pizza',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    base: { type: Object },
    sauce: { type: Object },
    cheese: { type: Object },
    veggie1: {
        type: Object
    },
    veggie2: {
        type: Object
    },
    meat: {
        type: Object
    },
    totalPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    confirmed: { type: Boolean, required: true, default: false },
    status: { type: String, default: 'created' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    razorpayPaymentId: { type: String },
    razorpayOrderId: { type: String },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema, 'orders');

module.exports = Order;