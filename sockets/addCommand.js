const models = require("../models")
const utils = require("./utils")

module.exports = socket => {
    return async (data) => {
        try {
            let o = await models.Command.findOne({
                where: {date: {[models.Sequelize.Op.eq]: new Date()}},
                order: [["number", "DESC"]]
            });
            let c = await models.Command.create({
                number: o ? o.number + 1 : 1,
                price: data.price
            });
            if (data.client)
                await c.setClient(await models.User.findByPk(data.client));
            if (data.pc)
                await c.setPc(await models.User.findByPk(data.pc));
            if (data.dish)
                await c.setDish(await models.Dish.findByPk(data.dish));
            if (data.ingredient)
                for (let i in data.ingredient)
                    await c.addIngredient(await models.Ingredient.findByPk(i));
            if (data.sauce)
                for (let s in data.sauce)
                    await c.addSauce(await models.Sauce.findByPk(s));
            if (data.drink)
                await c.addDrink(await models.Drink.findByPk(data.drink));
            if (data.dessert)
                await c.setDessert(await models.Drink.findByPk(data.dessert));

            let send = utils.commandExport(c);
            socket.emit("new command", send);
            socket.broadcast.emit("new command", send);
        } catch (e) {
            socket.emit("error");
            console.error(e);
        }
    }
}
