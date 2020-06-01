const models = require("../models");

module.exports = socket => {
    return async (data) => {
        try {
            let sandwich;
            let c = await models.Command.findOne({where: {number: {[models.Sequelize.Op.eq]: data}, date: {[models.Sequelize.Op.eq]: new Date()}}});
            let s = await models.Service.findOne({where:{date:{[models.Sequelize.Op.eq]: new Date()}}, include: ["sandwich1", "sandwich2", "sandwich3"]});
            if (!c)
                throw new Error("Command not found")
            else if (!s)
                throw new Error("Service not found");

            for (let sn of ["sandwich1", "sandwich2", "sandwich3"]) {
                await s.reload();
                if (!c.WIP && s[sn] && !s[sn + "Busy"]) {
                    sandwich = sn;
                    break;
                }
            }

            if (sandwich) {
                s[sandwich + "Busy"] = true;
                await c.setSandwich(s[sandwich]);
                c.WIP = true;
                await s.save();
                await c.save();
                let send = {
                    number: data,
                    sandwich: s[sandwich].username
                }
                socket.emit("WIP command", send);
                socket.broadcast.emit("WIP command", send);
            }
        } catch (e) {
            socket.emit("internal error");
            console.error(e);
        }
    }
}
