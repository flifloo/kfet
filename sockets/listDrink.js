const models = require("../models");
const utils = require("./utils");

module.exports = socket => {
    return async () => {
        let drinks = []
        for (let d of await models.Drink.findAll({
            order: ["name"]
        })) {
            drinks.push(utils.drinkExport(d));
        }
        socket.emit("list drink", drinks);
    }
}
