const CartModel = require('../models/cart-model');
const PizzaModel = require('../models/pizza-model');
const UserModel = require('../models/user-model');
const OrderModel = require('../models/order-model');
const shortid = require('shortid');
const orderService = require('../services/order-service');
const Razorpay = require('razorpay');
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = require('../config');
const crypto = require('crypto');

const stockService = require('../services/stock-service');


const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
});


class CartController {


    async getCartItems(req, res) {
        try {
            const cart = await CartModel.findOne({ userId: req.userId })
                .populate('pizzas.pizza', 'name quantity price')
                .select('-user -createdAt -updatedAt -__v');
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }
            return res.status(200).json(cart);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server Error' });
        }
    }



    async addToCart(req, res) {
        try {
            const { pizzaId, quantity } = req.body;
            const pizza = await PizzaModel.findById(pizzaId);
            if (!pizza) {
                return res.status(404).json({ message: 'Pizza not found' });
            }
            const user = await UserModel.findById(req.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check if pizza is in stock
            const isInStock = await stockService.checkPizzaAvailability(pizza, 1);
            if (!isInStock) {
                return res.status(404).json({ message: 'This pizza is not available at the moment!! Try some other pizza' });
            }

            let cart = await CartModel.findOne({ userId: req.userId });
            if (!cart) {
                cart = new CartModel({ userId: req.userId, pizzas: [] });
            }
            const existingPizza = cart.pizzas.find((p) => p.pizza.equals(pizzaId));
            if (existingPizza) {
                existingPizza.quantity += quantity;
                existingPizza.price += quantity * pizza.price;
            } else {
                cart.pizzas.push({
                    pizza: pizzaId,
                    quantity: quantity,
                    price: quantity * pizza.price,
                });
            }

            if (cart.total) {
                cart.total += quantity * pizza.price;
            } else {
                cart.total = quantity * pizza.price;
            }
            await cart.save();
            return res.status(200).json({ message: "Pizza added to the cart", cart });
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ message: 'Server Error' });
        }
    }


    async removeFromCart(req, res) {
        try {
            const { pizzaId } = req.body;
            console.log(req.body);
            const cart = await CartModel.findOne({ userId: req.userId });
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }


            const pizzaIndex = cart.pizzas.findIndex((p) => p.pizza.equals(pizzaId));
            if (pizzaIndex === -1) {
                return res.status(404).json({ message: 'Pizza not found in cart' });
            }
            const pizza = cart.pizzas[pizzaIndex];
            cart.total -= pizza.price;
            cart.pizzas.splice(pizzaIndex, 1);
            await cart.save();
            return res.status(200).json({ message: "Pizza removed from cart", cart });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server Error' });
        }
    }


    async orderCart(req, res) {
        try {
            const cart = await CartModel.findOne({ userId: req.userId })
                .populate('pizzas.pizza')
                .select('-user -createdAt -updatedAt -__v');
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }
            if (cart.pizzas.length === 0) {
                return res.status(400).json({ message: 'Your cart is empty' });
            }
            console.log(cart.pizzas);

            const totalPrice = cart.total;

            const isInStock = await stockService.checkPizzaAvailabilityForCart(cart.pizzas);
            console.log(isInStock);
            if (!isInStock.isInStock) {
                return res.status(404).json({ message: `${isInStock.pizza.name} is not available for this quantity` });
            }

            const { address, phone } = req.body;

            // Create the order
            const orderId = shortid.generate();
            console.log(cart);
            const order = new OrderModel({
                userId: req.userId,
                orderId,
                pizzas: cart.pizzas,
                totalPrice,
                address,
                phone
            });
            await order.save();

            const razorpayOrder = await razorpay.orders.create({
                amount: totalPrice * 100, // Amount in paise
                currency: 'INR',
                receipt: orderId,
            });

            // Clear the cart
            // cart.pizzas = [];
            // cart.total = 0;
            // await cart.save();

            // Send a confirmation email to the user
            const user = await UserModel.findById(req.userId);
            // const emailText = `Your order of ${order.pizzas.length} pizzas has been placed. Total: $${totalPrice}.`;
            // await sendEmail(user.email, 'Pizza Order Confirmation', emailText);
            res.status(201).json({
                message: 'Order placed successfully',
                order: {
                    orderId,
                    _id: order._id,
                    pizzas: order.pizzas,
                    total: order.total,
                    address: order.address,
                    phone: order.phone,
                    razorpayOrder,
                    createdAt: order.createdAt
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Something went wrong' });
        }
    }

    async confirmCartOrder(req, res) {
        try {
            const userId = req.userId;
            const user = await UserModel.findById(userId);



            console.log(req.query);
            const orderId = req.query.orderId;
            const { razorpay_payment_id: razorpayPaymentId, razorpay_order_id: razorpayOrderId, razorpay_signature: razorpaySignature } = req.body;
            console.log(orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature);

            const body = razorpayOrderId + "|" + razorpayPaymentId;
            const expectedSignature = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET).update(body.toString()).digest('hex');
            const isAuthentic = expectedSignature === razorpaySignature;

            if (!isAuthentic) {
                return res.status(400).json({ message: 'Request signature did not match. Please try again with a valid signature.' })

            } else {
                // res.redirect(`http://localhost:3000/cart`);
            }

            const order = await OrderModel.findOne({ userId, orderId });
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            if (order.status !== 'created') {
                return res.status(400).json({ message: 'Order already processed' });
            }

            // Update order status
            order.status = 'in_kitchen';
            order.confirmed = true;
            order.razorpayPaymentId = razorpayPaymentId;
            order.razorpayOrderId = razorpayOrderId;
            await order.save();


            const cart = await CartModel.findOne({ userId: req.userId })
                .populate('pizzas.pizza')
                .select('-user -createdAt -updatedAt -__v');
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }
            if (cart.pizzas.length === 0) {
                return res.status(400).json({ message: 'Your cart is empty' });
            }

            await orderService.updateStockCart(cart);

            // Clear the cart
            cart.pizzas = [];
            cart.total = 0;
            await cart.save();

            const eventEmitter = req.app.get('eventEmitter');
            eventEmitter.emit('orderConfirmedCart', { name: user.name });

            res.json({ message: 'Order confirmed' });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });

        }
    }

}

module.exports = new CartController();