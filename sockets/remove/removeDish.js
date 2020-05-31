const models = require("../../models");

module.exports = socket => {
    return async (data) => {
        try {
            let d = await models.Dish.findByPk(data);
            if (!d)
                throw new Error("Dish not found !");

            await d.destroy();

            socket.emit("remove dish", d.id);
            socket.broadcast.emit("remove dish", d.id);
        } catch (e) {
            socket.emit("internal error");
            console.error(e);
        }
    }
}
