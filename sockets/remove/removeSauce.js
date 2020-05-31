const models = require("../../models");

module.exports = socket => {
    return async (data) => {
        try {
            let s = await models.Sauce.findByPk(data);
            if (!s)
                throw new Error("Sauce not found !");

            await s.destroy();

            socket.emit("remove sauce", s.id);
            socket.broadcast.emit("remove sauce", s.id);
        } catch (e) {
            socket.emit("internal error");
            console.error(e);
        }
    }
}
