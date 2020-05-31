const models = require("../models");
const utils = require("./utils");

module.exports = socket => {
    return async (data) => {
        try {
            let i = await models.Ingredient.findByPk(data.id);
            if (!i)
                throw new Error("Ingredient not found !");

            if (await utils.update(i, data)) {
                let send = utils.ingredientExport(i);
                socket.emit("set ingredient", send);
                socket.broadcast.emit("set ingredient", send);
            }
        } catch (e) {
            socket.emit("internal error");
            console.error(e);
        }
    }
}
