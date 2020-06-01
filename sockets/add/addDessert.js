const models = require("../../models");
const utils = require("../utils");

module.exports = socket => {
    return async (data) => {
        try {
            try {
                let d = await models.Dessert.create({
                    name: data.name,
                    available: data.available,
                    price: data.price
                });

                let send = utils.dessertExport(d);
                socket.emit("add dessert", send);
                socket.broadcast.emit("add dessert", send);
            } catch (e) {
                if (e instanceof models.Sequelize.ValidationError)
                    socket.emit("fail add dessert", data);
                else
                    throw e;
            }
        } catch (e) {
            socket.emit("internal error");
            console.error(e);
        }
    }
}
