const models = require("../../models");
const utils = require("../utils");

module.exports = socket => {
    return async (data) => {
        try {
            try {
                let i = await models.Ingredient.create({
                    name: data.name,
                    available: data.available,
                    price: data.price
                });

                let send = utils.ingredientExport(i);
                socket.emit("add ingredient", send);
                socket.broadcast.emit("add ingredient", send);
            } catch (e) {
                if (e instanceof models.Sequelize.ValidationError)
                    socket.emit("fail add ingredient", data);
                else
                    throw e;
            }
        } catch (e) {
            socket.emit("internal error");
            console.error(e);
        }
    }
}
