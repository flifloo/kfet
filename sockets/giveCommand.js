const models = require("../models")

module.exports = socket => {
    return async (data) => {
        try {
            let c = await models.Command.findByPk(data);
            if (!c)
                throw new Error("Command not found");

            c.give = new Date()

            let service = models.Service.findOne({where:{date:{[models.Sequelize.Op.eq]: new Date()}}});
            if (c.WIP && service) {
                let sandwiches = [service.sandwich1Id, service.sandwich2Id, service.sandwich3Id]
                if (c.sandwichId in sandwiches)
                    service["sandwich"+sandwiches.indexOf(c.sandwichId)+1] = false;
            }
            c.WIP = false;

            await c.save();
            socket.emit("give command", data);
            socket.broadcast.emit("give command", data);
        } catch (e) {
            socket.emit("error");
            console.error(e);
        }
    }
}
