const models = require("../models");
const utils = require("./utils");

module.exports = socket => {
    return async (data) => {
        try {
            let s = await models.Sauce.findByPk(data.id);
            if (!s)
                throw new Error("Sauce not found !");

            if (await utils.update(s, data)) {
                let send = utils.sauceExport(s);
                socket.emit("set sauce", send);
                socket.broadcast.emit("set sauce", send);
            }
        } catch (e) {
            socket.emit("internal error");
            console.error(e);
        }
    }
}
