const StockModel = require('../models/stock-model');
const BaseModel = require('../models/base-model');
const SauceModel = require('../models/sauce-model');
const CheeseModel = require('../models/cheese-model');
const VeggiesModel = require('../models/veggies-model');
const MeatModel = require('../models/meat-model');

class OrderService {
    async checkOrder(_base, _sauce, _cheese, _veggies, _meat, quantity) {
        console.log(_base, _sauce, _cheese, _veggies, _meat);
        const _baseStock = await BaseModel.findOne({ name: _base.name });
        console.log(_baseStock);
        if (!_baseStock || _baseStock.stock < quantity) {
            return { validOrder: false };
        }

        const _sauceStock = await SauceModel.findOne({ name: _sauce.name });
        if (!_sauceStock || _sauceStock.stock < quantity) {
            return { validOrder: false };
        }

        const _cheeseStock = await CheeseModel.findOne({ name: _cheese.name });
        if (!_cheeseStock) {
            return { validOrder: false };
        }


        let _veggiesStock1;
        let _veggiesStock2;
        if (_veggies.length === 0) {
            _veggiesStock1 = null;
            _veggiesStock2 = null;
        } else if (_veggies.length === 1) {

            _veggiesStock1 = await VeggiesModel.findOne({ name: _veggies[0].name });
            if (!_veggiesStock1) {
                return { validOrder: false };
            }
        } else if (_veggies.length === 2) {

            _veggiesStock2 = await VeggiesModel.findOne({ name: _veggies[1].name });
            if (!_veggiesStock2) {
                return { validOrder: false };
            }
        }



        // if (_veggies.length === 0 || _veggies.length === 1) {
        // } else {

        // }

        let _meatStock;
        if (_meat.length === 0) {
            _meatStock = undefined;
        } else {

            _meatStock = await MeatModel.findOne({ name: _meat[0].name });
            if (!_meatStock) {
                return { validOrder: false };
            }
        }


        return {
            validOrder: true,
            _baseStock,
            _sauceStock,
            _cheeseStock,
            _veggiesStock1,
            _veggiesStock2,
            _meatStock,
            _quantity: quantity
        }

    }



    async updateStock(order) {
        try {
            const { base, sauce, cheese, veggie1, veggie2, meat, quantity } = order;
            if (base.name !== "") {
                await BaseModel.findOneAndUpdate({
                    name: base.name
                }, {
                    $inc: {
                        stock: -quantity
                    }
                });
            }

            if (sauce.name !== "") {
                await SauceModel.findOneAndUpdate({
                    name: sauce.name
                }, {
                    $inc: {
                        stock: -quantity
                    }
                });
            }


        } catch (err) {
            console.log(err);
        }
    }

    async updateBaseStock(base) {
        if (base && base.name && base.quantity) {
            await BaseModel.findOneAndUpdate({
                name: base.name
            }, {
                $inc: {
                    stock: base.quantity
                }
            }, {
                $new: true
            });
        }
    }

    async updateSauceStock(sauce) {


        if (sauce && sauce.name && sauce.quantity) {
            await SauceModel.findOneAndUpdate({
                name: sauce.name
            }, {
                $inc: {
                    stock: sauce.quantity
                }
            }, {
                $new: true
            });
        }
    }


    async updateStockCart(cart) {
        cart.pizzas.forEach(async(pizza, idx) => {

            await BaseModel.findOneAndUpdate({
                name: pizza.pizza.base.name
            }, {
                $inc: {
                    stock: -1
                }
            }, {
                $new: true
            });

            await SauceModel.findOneAndUpdate({
                name: pizza.pizza.sauce.name
            }, {
                $inc: {
                    stock: -1
                }
            }, {
                $new: true
            });
        });
    }
}

module.exports = new OrderService();