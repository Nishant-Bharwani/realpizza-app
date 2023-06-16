// const io = require('../socket').get();
const PizzaModel = require('../models/pizza-model');
const OrderModel = require('../models/order-model');
const BaseModel = require('../models/base-model');
const SauceModel = require('../models/sauce-model');
const CheeseModel = require('../models/cheese-model');
const VeggiesModel = require('../models/veggies-model');
const MeatModel = require('../models/meat-model');
const { validationResult } = require('express-validator');
const orderService = require('../services/order-service');




class AdminController {
    async getAllPizzas(req, res) {
        try {
            const pizzas = await PizzaModel.find();
            res.json(pizzas);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getAllOrders(req, res) {
        try {
            const orders = await OrderModel.find({
                confirmed: true
            }).populate('userId').select('-password').populate('pizzas.pizza').sort({ date: -1 });
            res.json(orders);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getAllBases(req, res) {
        try {
            const bases = await BaseModel.find();
            res.json(bases);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getAllSauces(req, res) {
        try {
            const sauces = await SauceModel.find();
            res.json(sauces);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getAllCheeses(req, res) {
        try {
            const cheeses = await CheeseModel.find();
            res.json(cheeses);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getAllVeggies(req, res) {
        try {
            const veggies = await VeggiesModel.find();
            res.json(veggies);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getAllMeats(req, res) {
        try {
            const meats = await MeatModel.find();
            res.json(meats);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updatePizzaCount(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }

            const { pizzaId } = req.params;
            const { count } = req.body;

            // Update pizza count
            const pizza = await PizzaModel.findById(pizzaId);
            if (!pizza) {
                return res.status(404).json({ message: 'Pizza not found' });
            }
            pizza.count = count;
            await pizza.save();

            res.json(pizza);



        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }


    async handleOrder(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const { orderId } = req.body;
        const { status } = req.body;

        const order = await OrderModel.findOne({ orderId });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        order.status = status;
        await order.save();
        console.log(order);
        // console.log(io);
        // io.to(`order_${orderId}`).emit('order_update', order);


        const eventEmitter = req.app.get('eventEmitter');
        eventEmitter.emit('orderUpdated', order);
        res.status(200).json({ message: "Order Status Updated" });
    }

    async updateBaseStock(req, res) {
        const { baseId, quantity } = req.body;
        try {
            await BaseModel.findOneAndUpdate({
                _id: baseId
            }, {
                $inc: {
                    stock: quantity
                }
            }, {
                $new: true
            });

            res.status(200).json({ message: "Stock Updated" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateSauceStock(req, res) {
        const { sauceId, quantity } = req.body;
        try {
            await SauceModel.findOneAndUpdate({
                _id: sauceId
            }, {
                $inc: {
                    stock: quantity
                }
            }, {
                $new: true
            });

            res.status(200).json({ message: "Stock Updated" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new AdminController();