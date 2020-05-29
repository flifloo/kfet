const models = require("../models")

module.exports = socket => {
    return async () => {
        let commands = []
        for (let c of await models.Command.findAll({
            where: {
                date: {
                    [models.Sequelize.Op.eq]: new Date()
                }
            },
            order: ["number"],
            include: [models.Dish, models.Ingredient, models.Sauce, models.Drink, models.Dessert, "client", "pc", "sandwich"]
        })) {
            commands.push({
                number: c.number,
                sandwich: c.sandwich ? c.sandwich.username : null,
                client: c.client ? c.client.firstName + " " + c.client.lastName : null,
                dish: c.Dish ? c.Dish.name : null,
                ingredients: c.Ingredients ? c.Ingredients.map(i => i.name) : null,
                sauces: c.Sauces ? c.Sauces.map(s => s.name) : null,
                drink: c.Drink ? c.Drink.name : null,
                dessert: c.Dessert ? c.Dessert.name : null,
                error: c.error,
                give: c.give,
                done: c.done,
                WIP: c.WIP
            });
        }
        socket.emit("list command", commands);
    }
}
