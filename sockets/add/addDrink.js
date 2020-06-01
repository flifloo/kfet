const models = require("../../models");
const utils = require("../utils");

module.exports = socket => {
    return async (data) => {
        try {
            try {
                let d = await models.Drink.create({
                    name: data.name,
                    available: data.available,
                    price: data.price
                });

                let send = utils.drinkExport(d);
                socket.emit("add drink", send);
                socket.broadcast.emit("add drink", send);
            } catch (e) {
                if (e instanceof models.Sequelize.ValidationError)
                    socket.emit("fail add drink", data);
                else
                    throw e;
            }
        } catch (e) {
            socket.emit("internal error");
            console.error(e);
        }
    }
}
