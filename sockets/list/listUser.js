const models = require("../../models");

module.exports = socket => {
    return async data => {
        let users = []
        for (let u of await models.User.findAll({
            where: {
                username: {
                    [models.Sequelize.Op.like]: data + "%"
                }
            }
        })) {
            users.push(u.username);
        }
        socket.emit("list user", users);
    }
}
