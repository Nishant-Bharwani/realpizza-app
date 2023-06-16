const adminRouter = require('express').Router();
const adminController = require('../controllers/admin-controller');
const adminMiddleware = require('../middlewares/admin-middleware');
const authMiddleware = require('../middlewares/auth-middleware');

const { body } = require('express-validator');

adminRouter.get('/inventory', authMiddleware, adminController.getAllPizzas); //admin
// adminRouter.put('/inventory/:pizzaId', [body('count').isInt().withMessage('Count must be an integer'), authMiddleware], adminController.updatePizzaCount);
adminRouter.get('/getBases', adminMiddleware, adminController.getAllBases); //admin
adminRouter.get('/getSauces', adminMiddleware, adminController.getAllSauces); //admin
adminRouter.get('/getCheeses', adminMiddleware, adminController.getAllCheeses);
adminRouter.get('/getVeggies', adminMiddleware, adminController.getAllVeggies);
adminRouter.get('/getMeats', adminMiddleware, adminController.getAllMeats);

adminRouter.put('/updateOrderStatus', adminMiddleware, adminController.handleOrder); //admin
// adminRouter.put('/updateOrderStatus', [
//     body('status').isIn(['created', 'confirmed', 'in_kitchen', 'sent_to_delivery', 'delivered']).withMessage('Invalid status'),
//     authMiddleware,
// ], adminController.handleOrder); //admin

adminRouter.put('/updateBaseStock', adminMiddleware, adminController.updateBaseStock); //admin
adminRouter.put('/updateSauceStock', adminMiddleware, adminController.updateSauceStock); //admin

adminRouter.get('/getAllOrders', adminMiddleware, adminController.getAllOrders);


module.exports = adminRouter;