const models = require("../../models");
const utils = require("../utils");

module.exports = socket => {
    return async (data) => {
        try {
            try {
                let d = await models.Dish.create({
                    name: data.name,
                    available: data.available,
                    price: data.price,
                    maxIngredients: data.maxIngredients,
                    maxSauces: data.maxSauces
                });

                let send = utils.dishExport(d);
                socket.emit("add dish", send);
                socket.broadcast.emit("add dish", send);
            } catch (e) {
                if (e instanceof models.Sequelize.ValidationError)
                    socket.emit("fail add dish", data);
                else
                    throw e;
            }
        } catch (e) {
            socket.emit("internal error");
            console.error(e);
        }
    }
}
