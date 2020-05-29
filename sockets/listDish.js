const models = require("../models")

module.exports = socket => {
    return async () => {
        let dishes = []
        for (let d of await models.Dish.findAll()) {
            dishes.push({
                id: d.id,
                name: d.name,
                price: d.price,
                avoidIngredients: d.avoidIngredients,
                avoidSauces: d.avoidSauces
            });
        }
        socket.emit("list dish", dishes);
    }
}
