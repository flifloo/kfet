const models = require("../models")

module.exports = socket => {
    return async (data) => {
        try {
            let c = await models.Command.findByPk(data);
            if (!c)
                throw new Error("Command not found");
            c.done = null;
            c.give = null;
            c.error = false;

            let service = models.Service.findOne({where:{date:{[models.Sequelize.Op.eq]: new Date()}}});
            if (c.WIP && service) {
                let sandwichs = [service.sandwich1Id, service.sandwich2Id, service.sandwich3Id]
                if (c.sandwichId in sandwichs)
                    service["sandwich"+sandwichs.indexOf(c.sandwichId)+1] = false;
            }
            c.WIP = false;

            await c.save();
            socket.emit("clear command", data);
            socket.broadcast.emit("clear command", data);
        } catch (e) {
            socket.emit("error");
            console.error(e);
        }
    }
}
