const BaseModel = require('../models/base-model');
class StockService {
    async checkPizzaAvailability(pizza, quantity) {
        console.log(pizza);
        const base = await BaseModel.findOne({
            name: pizza.base.name
        });

        const isBaseAvailable = base.stock >= quantity;

        if (!isBaseAvailable) {
            return false;
        }
        const sauce = await BaseModel.findOne({
            name: pizza.base.name
        });

        const isSauceAvailable = sauce.stock >= quantity;
        if (!isSauceAvailable) {
            return false;
        }

        return true;

    }


    async checkPizzaAvailabilityForCart(pizzas) {
        for (let pizza of pizzas) {
            console.log("Pizza", pizza.pizza);
            const isPizzaInStock = await this.checkPizzaAvailability(pizza.pizza, pizza.quantity);
            if (!isPizzaInStock) {
                return {
                    isInStock: false,
                    pizza: pizza.pizza
                };
            }
        }
        return {
            isInStock: true
        };
    }

}

module.exports = new StockService();