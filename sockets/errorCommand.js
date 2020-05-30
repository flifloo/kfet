const models = require("../models");

module.exports = socket => {
    return async (data) => {
        try {
            let c = await models.Command.findByPk(data);
            if (!c)
                throw new Error("Command not found");

            c.error = true;

            await c.save();
            socket.emit("error command", data);
            socket.broadcast.emit("error command", data);
        } catch (e) {
            socket.emit("internal error");
            console.error(e);
        }
    }
}
