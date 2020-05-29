const models = require("../models")

module.exports = socket => {
    return async () => {
        let sauces = []
        for (let d of await models.Sauce.findAll()) {
            sauces.push({
                id: d.id,
                name: d.name,
                price: d.price
            });
        }
        socket.emit("list sauce", sauces);
    }
}
