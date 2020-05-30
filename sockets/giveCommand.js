const models = require("../models");
const utils = require("./utils");

module.exports = socket => {
    return async (data) => {
        try {
            let c = await models.Command.findByPk(data);
            if (!c)
                throw new Error("Command not found");

            c.give = new Date()

            utils.resetService(c, await models.Service.findOne({where:{date:{[models.Sequelize.Op.eq]: new Date()}}}));
            c.WIP = false;

            await c.save();
            socket.emit("give command", data);
            socket.broadcast.emit("give command", data);
        } catch (e) {
            socket.emit("internal error");
            console.error(e);
        }
    }
}
