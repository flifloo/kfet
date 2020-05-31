const models = require("../../models");

module.exports = socket => {
    return async (data) => {
        try {
            let s = await models.Service.findOne({where: {date: {[models.Sequelize.Op.eq]: new Date()}}, include: ["sandwich1", "sandwich2", "sandwich3", "commi1", "commi2"]})
            if (!s)
                s = await models.Service.create();

            for (let u in data)
                await s["set"+u.charAt(0).toUpperCase()+u.slice(1)](data[u]);

            socket.emit("set service", data);
            socket.broadcast.emit("set service", data);
        } catch (e) {
            socket.emit("internal error");
            console.error(e);
        }
    }
}
