const pizzaRouter = require('express').Router();
const authMiddleware = require('../middlewares/auth-middleware');
const pizzaController = require('../controllers/pizza-controller');


pizzaRouter.get('/', pizzaController.getAllPizzas);
pizzaRouter.get('/getBases', authMiddleware, pizzaController.getAllBases);
pizzaRouter.get('/getSauces', authMiddleware, pizzaController.getAllSauces);
pizzaRouter.get('/getCheeses', authMiddleware, pizzaController.getAllCheeses);
pizzaRouter.get('/getVeggies', authMiddleware, pizzaController.getAllVeggies);


module.exports = pizzaRouter;