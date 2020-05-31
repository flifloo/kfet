const models = require("../../models");
const utils = require("../utils");

module.exports = socket => {
    return async () => {
        let ingredients = []
        for (let i of await models.Ingredient.findAll({
            order: ["name"]
        })) {
            ingredients.push(utils.ingredientExport(i));
        }
        socket.emit("list ingredient", ingredients);
    }
}
