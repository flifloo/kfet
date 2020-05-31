const models = require("../../models");

module.exports = socket => {
    return async (data) => {
        try {
            let d = await models.Drink.findByPk(data);
            if (!d)
                throw new Error("Drink not found !");

            await d.destroy();

            socket.emit("remove drink", d.id);
            socket.broadcast.emit("remove drink", d.id);
        } catch (e) {
            socket.emit("internal error");
            console.error(e);
        }
    }
}
