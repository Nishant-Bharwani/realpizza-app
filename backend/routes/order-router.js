const orderRouter = require('express').Router();
const Razorpay = require('razorpay');

const authMiddleware = require('../middlewares/auth-middleware');

const orderController = require('../controllers/order-controller');


const { pizzaValidationSchema } = require('../middlewares/pizzaValidator-middleware');
const cartController = require('../controllers/cart-controller');


orderRouter.get('/:userId', authMiddleware, orderController.getAllOrders);
orderRouter.post('/getOrder', authMiddleware, orderController.getOrder);
orderRouter.post('/createOrder', pizzaValidationSchema, authMiddleware, orderController.createOrder);
orderRouter.post('/confirmOrder', authMiddleware, orderController.confirmOrder);
orderRouter.post('/addToCart', authMiddleware, cartController.addToCart);
orderRouter.post('/getCart/:userId', authMiddleware, cartController.getCartItems);
orderRouter.post('/removeFromCart', authMiddleware, cartController.removeFromCart);
orderRouter.post('/orderCart', authMiddleware, cartController.orderCart);
orderRouter.post('/confirmCartOrder', authMiddleware, cartController.confirmCartOrder);


module.exports = orderRouter;