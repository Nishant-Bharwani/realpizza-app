const PizzaModel = require('../models/pizza-model');
const BaseModel = require('../models/base-model');
const SauceModel = require('../models/sauce-model');
const CheeseModel = require('../models/cheese-model');
const VeggiesModel = require('../models/veggies-model');


class PizzaController {
    async getAllPizzas(req, res) {
        try {
            const pizzas = await PizzaModel.find();
            res.json(pizzas);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }


    async getAllBases(req, res) {
        try {
            const bases = await BaseModel.find().select('-_id -price -stock');
            console.log(bases);
            res.json(bases);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getAllSauces(req, res) {
        try {
            const sauces = await SauceModel.find().select('-_id -price -stock');
            res.json(sauces);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getAllCheeses(req, res) {
        try {
            const cheeses = await CheeseModel.find().select('-_id -price');
            res.json(cheeses);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getAllVeggies(req, res) {
        try {
            const veggies = await VeggiesModel.find().select('-_id -price');
            res.json(veggies);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }


}

module.exports = new PizzaController();