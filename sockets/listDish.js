const models = require("../models");

module.exports = socket => {
    return async () => {
        let dishes = []
        for (let d of await models.Dish.findAll({
            order: ["name"]
        })) {
            dishes.push({
                id: d.id,
                name: d.name,
                price: d.price,
                maxIngredients: d.maxIngredients,
                maxSauces: d.maxSauces
            });
        }
        socket.emit("list dish", dishes);
    }
}
