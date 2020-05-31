const models = require("../../models");
const utils = require("../utils");

module.exports = socket => {
    return async (data) => {
        try {
            let d = await models.Drink.findByPk(data.id);
            if (!d)
                throw new Error("Drink not found !");

            if (await utils.update(d, data)) {
                let send = utils.drinkExport(d);
                socket.emit("set drink", send);
                socket.broadcast.emit("set drink", send);
            }
        } catch (e) {
            socket.emit("internal error");
            console.error(e);
        }
    }
}
