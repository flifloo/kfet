const models = require("../../models");
const utils = require("../utils");

module.exports = socket => {
    return async () => {
        let desserts = []
        for (let d of await models.Dessert.findAll({
            order: ["name"]
        })) {
            desserts.push(utils.dessertExport(d));
        }
        socket.emit("list dessert", desserts);
    }
}
