const models = require("../../models");
const utils = require("../utils");

module.exports = socket => {
    return async () => {
        let sauces = []
        for (let s of await models.Sauce.findAll({
            order: ["name"]
        })) {
            sauces.push(utils.sauceExport(s));
        }
        socket.emit("list sauce", sauces);
    }
}
