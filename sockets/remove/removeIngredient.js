const models = require("../../models");

module.exports = socket => {
    return async (data) => {
        try {
            let i = await models.Ingredient.findByPk(data);
            if (!i)
                throw new Error("Ingredient not found !");

            await i.destroy();

            socket.emit("remove ingredient", i.id);
            socket.broadcast.emit("remove ingredient", i.id);
        } catch (e) {
            socket.emit("internal error");
            console.error(e);
        }
    }
}
