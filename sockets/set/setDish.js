const models = require("../../models");
const utils = require("../utils");

module.exports = socket => {
    return async (data) => {
        try {
            let d = await models.Dish.findByPk(data.id);
            if (!d)
                throw new Error("Dish not found !");

            if (await utils.update(d, data)) {
                let send = utils.dishExport(d);
                socket.emit("set dish", send);
                socket.broadcast.emit("set dish", send);
            }
        } catch (e) {
            socket.emit("internal error");
            console.error(e);
        }
    }
}
