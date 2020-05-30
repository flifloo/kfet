const models = require("../models");

module.exports = socket => {
    return async () => {
        let ingredients = []
        for (let i of await models.Ingredient.findAll()) {
            ingredients.push({
                id: i.id,
                name: i.name,
                price: i.price
            });
        }
        socket.emit("list ingredient", ingredients);
    }
}
