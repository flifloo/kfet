const models = require("../models");
const utils = require("./utils");

module.exports = socket => {
    return async (data) => {
        try {
            let o = await models.Command.findOne({
                where: {date: {[models.Sequelize.Op.eq]: new Date()}},
                order: [["number", "DESC"]]
            });
            let c = await models.Command.create({
                number: o ? o.number + 1 : 1,
                price: await utils.price(data)
            });
            if (data.client)
                await c.setClient(await models.User.findByPk(data.client));
            if (data.pc)
                await c.setPc(await models.User.findByPk(data.pc));
            if (data.dish)
                await c.setDish(await models.Dish.findByPk(data.dish));
            if (data.ingredient)
                for (let i of data.ingredient)
                    await c.addIngredient(await models.Ingredient.findByPk(i));
            if (data.sauce)
                for (let s of data.sauce)
                    await c.addSauce(await models.Sauce.findByPk(s));
            if (data.drink)
                await c.setDrink(await models.Drink.findByPk(data.drink));
            if (data.dessert)
                await c.setDessert(await models.Dessert.findByPk(data.dessert));

            let send = utils.commandExport(await models.Command.findByPk(c.id, {include: [models.Dish, models.Ingredient, models.Sauce, models.Drink, models.Dessert, "client", "pc", "sandwich"]}));
            socket.emit("new command", send);
            socket.broadcast.emit("new command", send);
        } catch (e) {
            socket.emit("internal error");
            console.error(e);
        }
    }
}
