const models = require("../models");

module.exports = socket => {
    return async () => {
        let desserts = []
        for (let i of await models.Dessert.findAll({
            order: ["name"]
        })) {
            desserts.push({
                id: i.id,
                name: i.name,
                price: i.price
            });
        }
        socket.emit("list dessert", desserts);
    }
}
