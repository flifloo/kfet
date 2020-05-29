const models = require("../models")
const utils = require("./utils")

module.exports = socket => {
    return async () => {
        let commands = []
        for (let c of await models.Command.findAll({
            where: {
                date: {
                    [models.Sequelize.Op.eq]: new Date()
                }
            },
            order: ["number"],
            include: [models.Dish, models.Ingredient, models.Sauce, models.Drink, models.Dessert, "client", "pc", "sandwich"]
        })) {
            commands.push(utils.commandExport(c));
        }
        socket.emit("list command", commands);
    }
}
