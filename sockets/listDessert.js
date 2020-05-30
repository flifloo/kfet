const models = require("../models");

module.exports = socket => {
    return async () => {
        let desserts = []
        for (let i of await models.Dessert.findAll()) {
            desserts.push({
                id: i.id,
                name: i.name,
                price: i.price
            });
        }
        socket.emit("list dessert", desserts);
    }
}
