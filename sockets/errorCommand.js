const models = require("../models");

module.exports = socket => {
    return async (data) => {
        try {
            let c = await models.Command.findOne({where: {number: {[models.Sequelize.Op.eq]: data}, date: {[models.Sequelize.Op.eq]: new Date()}}});
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
