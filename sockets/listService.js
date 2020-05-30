const models = require("../models");

module.exports = socket => {
    return async () => {
        let send = null;
        let service = await models.Service.findOne({
            where: {
                date: {
                    [models.Sequelize.Op.eq]: new Date()
                }
            },
            include: ["sandwich1", "sandwich2", "sandwich3", "commi1", "commi2"]
        })
        if (service)
            send = {
                sandwich1: service.sandwich1 ? service.sandwich1.username : null,
                sandwich2: service.sandwich2 ? service.sandwich2.username : null,
                sandwich3: service.sandwich3 ? service.sandwich3.username : null,
                commi1: service.commi1 ? service.commi1.username: null,
                commi2: service.commi2 ? service.commi2.username : null
            }
        socket.emit("list service", send);
    }
}
