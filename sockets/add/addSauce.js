const models = require("../../models");
const utils = require("../utils");

module.exports = socket => {
    return async (data) => {
        try {
            try {
                let s = await models.Sauce.create({
                    name: data.name,
                    available: data.available,
                    price: data.price
                });

                let send = utils.sauceExport(s);
                socket.emit("add sauce", send);
                socket.broadcast.emit("add sauce", send);
            } catch (e) {
                if (e instanceof models.Sequelize.ValidationError)
                    socket.emit("fail add sauce", data);
                else
                    throw e;
            }
        } catch (e) {
            socket.emit("internal error");
            console.error(e);
        }
    }
}
