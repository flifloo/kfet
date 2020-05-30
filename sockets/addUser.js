const models = require("../models");

module.exports = socket => {
    return async (data) => {
        try {
            let u;
            try {
                u = await models.User.create({
                    username: data.username,
                    firstName: data.firstName,
                    lastName: data.lastName
                })
            } catch (e) {
                if (e instanceof models.Sequelize.ValidationError)
                    socket.emit("fail add user")
                else
                    throw e;
            }

            socket.emit("add user", u.username);
            socket.broadcast.emit("add user", u.username);
        } catch (e) {
            socket.emit("internal error");
            console.error(e);
        }
    }
}
