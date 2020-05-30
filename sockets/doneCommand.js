const models = require("../models");
const utils = require("./utils");

module.exports = socket => {
    return async (data) => {
        try {
            let c = await models.Command.findOne({where: {number: {[models.Sequelize.Op.eq]: data}, date: {[models.Sequelize.Op.eq]: new Date()}}});
            if (!c)
                throw new Error("Command not found");

            c.done = new Date();
            await utils.resetService(c);
            c.WIP = false;

            await c.save();
            socket.emit("done command", data);
            socket.broadcast.emit("done command", data);
        } catch (e) {
            socket.emit("internal error");
            console.error(e);
        }
    }
}
