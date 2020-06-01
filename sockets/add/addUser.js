const models = require("../../models");

module.exports = socket => {
    return async (data) => {
        try {
            try {
                await models.User.create({
                    username: data.username,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    passwordHash: data.password ? data.password : null
                });

                socket.emit("add user", data.username);
                socket.broadcast.emit("add user", data.username);
            } catch (e) {
                if (e instanceof models.Sequelize.ValidationError)
                    socket.emit("fail add user");
                else
                    throw e;
            }
        } catch (e) {
            socket.emit("internal error");
            console.error(e);
        }
    }
}
