const shortid = require('shortid');
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = require('../config');
const orderService = require('../services/order-service');
const userService = require('../services/user-service');
const OrderModel = require('../models/order-model');
const crypto = require('crypto');
const UserModel = require('../models/user-model');

const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
});



class OrderController {

    async getOrder(req, res) {
        const { orderId } = req.body;
        console.log(orderId);
        try {
            const orders = await OrderModel.findOne({
                orderId
            })
            res.json(orders);
        } catch (err) {
            console.log("Errrrrrrrrrrrrrrror", err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createOrder(req, res) {
        try {
            const errors = userService.checkValidation(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }

            const userId = req.userId;
            console.log(userId);

            const { base, sauce, cheese, veggies = [], meat = [], address = "", phone = "", quantity = 1 } = req.body;



            const { validOrder, _baseStock, _sauceStock, _cheeseStock, _veggiesStock1, _veggiesStock2, _meatStock, _quantity } = await orderService.checkOrder(base, sauce, cheese, veggies, meat, quantity);
            // console.log(validOrder);
            if (!validOrder) {
                // res.status(403).json({ message: "Order can't be made" });
                res.status(403).json({ message: "Out of Stock" });
            }



            let totalPrice = (_baseStock && _baseStock.price ? _baseStock.price : 0) +
                (_sauceStock && _sauceStock.price ? _sauceStock.price : 0) +
                (_cheeseStock && _cheeseStock.price ? _cheeseStock.price : 0) +
                (_veggiesStock1 && _veggiesStock1.price ? _veggiesStock1.price : 0) +
                (_veggiesStock2 && _veggiesStock2.price ? _veggiesStock2.price : 0) +
                (_meatStock && _meatStock.price ? _meatStock.price : 0);

            console.log(_quantity);
            totalPrice *= _quantity;

            const orderId = shortid.generate();
            const order = new OrderModel({
                userId,
                orderId,
                base: {
                    name: _baseStock && _baseStock.name ? _baseStock.name : "",
                    price: (_baseStock && _baseStock.price ? _baseStock.price : 0)
                },
                sauce: {
                    name: _sauceStock && _sauceStock.name ? _sauceStock.name : "",
                    price: (_sauceStock && _sauceStock.price ? _sauceStock.price : 0)
                },
                cheese: {
                    name: _cheeseStock && _cheeseStock.name ? _cheeseStock.name : "",
                    price: (_cheeseStock && _cheeseStock.price ? _cheeseStock.price : 0)
                },
                veggie1: {
                    name: _veggiesStock1 && _veggiesStock1.name ? _veggiesStock1.name : "",
                    price: (_veggiesStock1 && _veggiesStock1.price ? _veggiesStock1.price : 0)
                },
                veggie2: {
                    name: _veggiesStock2 && _veggiesStock2.name ? _veggiesStock2.name : "",
                    price: (_veggiesStock2 && _veggiesStock2.price ? _veggiesStock2.price : 0)
                },
                meat: {
                    name: _meatStock && _meatStock.name ? _meatStock.name : "",
                    price: (_meatStock && _meatStock.price ? _meatStock.price : 0)
                },
                totalPrice,
                quantity: _quantity,
                address,
                phone
            });

            await order.save();

            const razorpayOrder = await razorpay.orders.create({
                amount: totalPrice * 100, // Amount in paise
                currency: 'INR',
                receipt: orderId,
            });

            res.json({ order, razorpayOrder });


        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async confirmOrder(req, res) {
        try {
            const userId = req.userId;
            const orderId = req.query.orderId;
            const address = req.query.address;
            const phone = req.query.phone

            const user = await UserModel.findById(userId);


            const { razorpay_payment_id: razorpayPaymentId, razorpay_order_id: razorpayOrderId, razorpay_signature: razorpaySignature } = req.body;



            const body = razorpayOrderId + "|" + razorpayPaymentId;
            const expectedSignature = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET).update(body.toString()).digest('hex');
            const isAuthentic = expectedSignature === razorpaySignature;

            if (!isAuthentic) {
                return res.status(400).json({ message: 'Request signature did not match. Please try again with a valid signature.' })

            } else {
                res.redirect(`${process.env.CLIENT_URL}/custom-pizza`);
            }


            const order = await OrderModel.findOne({ userId, orderId });
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            if (order.status !== 'created') {
                return res.status(400).json({ message: 'Order already processed' });
            }

            order.address = address;
            order.phone = phone;

            // Update order status
            order.status = 'in_kitchen';
            order.confirmed = true;
            order.razorpayPaymentId = razorpayPaymentId;
            order.razorpayOrderId = razorpayOrderId;
            await order.save();


            await orderService.updateStock(order);

            const eventEmitter = req.app.get('eventEmitter');
            eventEmitter.emit('orderConfirmed', { name: user.name });

            res.json({ message: 'Order confirmed' });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }


    async getAllOrders(req, res) {
        const { userId } = req.params;
        try {
            const orders = await OrderModel.find({
                userId,
                confirmed: true
            }).populate('pizzas.pizza').select('-user -createdAt -updatedAt -__v').sort({ date: -1 });
            res.json(orders);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}


// {
//     "userId": "64423fb0212fec3a9e7ebaa6",
//     "base": {
//       "name": "Thin crust",
//       "price": 100
//     },
//     "sauce": {
//       "name": "Tomato sauce",
//       "price": 50
//     },
//     "cheese": {
//       "name": "Mozzarella",
//       "price": 75
//     },
//     "veggies": [
//       {
//         "name": "Onion",
//         "price": 20
//       },
//       {
//         "name": "Mushroom",
//         "price": 25
//       }
//     ],
//     "meat": [
//       {
//         "name": "Pepperoni",
//         "price": 30
//       }
//     ]
//   }

module.exports = new OrderController();













// {
//     "base": {
//       "name": "Thin crust"
//     },
//     "sauce": {
//       "name": "Tomato sauce"
//     },
//     "cheese": {
//       "name": "Mozzarella"
//     },
//     "veggies": [
//       {
//         "name": "Onion"
//       },
//       {
//         "name": "Mushroom"
//       }
//     ],
//     "meat": [
//       {
//         "name": "Pepperoni",
//         "price": 30
//       }
//     ]
//   }