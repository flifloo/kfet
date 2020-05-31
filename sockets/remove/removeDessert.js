const models = require("../../models");

module.exports = socket => {
    return async (data) => {
        try {
            let d = await models.Dessert.findByPk(data);
            if (!d)
                throw new Error("Dessert not found !");

            await d.destroy();

            socket.emit("remove dessert", d.id);
            socket.broadcast.emit("remove dessert", d.id);
        } catch (e) {
            socket.emit("internal error");
            console.error(e);
        }
    }
}
