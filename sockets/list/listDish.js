const models = require("../../models");
const utils = require("../utils");

module.exports = socket => {
    return async () => {
        let dishes = []
        for (let d of await models.Dish.findAll({
            order: ["name"]
        })) {
            dishes.push(utils.dishExport(d));
        }
        socket.emit("list dish", dishes);
    }
}
