const models = require("../models");
const utils = require("./utils");

module.exports = socket => {
    return async (data) => {
        try {
            let d = await models.Dessert.findByPk(data.id);
            if (!d)
                throw new Error("Dessert not found !");

            if (await utils.update(d, data)) {
                let send = utils.dessertExport(d);
                socket.emit("set dessert", send);
                socket.broadcast.emit("set dessert", send);
            }
        } catch (e) {
            socket.emit("internal error");
            console.error(e);
        }
    }
}
