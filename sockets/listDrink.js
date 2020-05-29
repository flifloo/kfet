const models = require("../models")

module.exports = socket => {
    return async () => {
        let drinks = []
        for (let i of await models.Drink.findAll()) {
            drinks.push({
                id: i.id,
                name: i.name,
                price: i.price
            });
        }
        socket.emit("list drink", drinks);
    }
}
