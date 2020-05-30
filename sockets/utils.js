const models = require("../models");

function commandExport (c) {
    return {
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
    }
}

async function resetService(c) {
    let service = await models.Service.findOne({where:{date:{[models.Sequelize.Op.eq]: new Date()}}, include: ["sandwich1", "sandwich2", "sandwich3"]});
    if (c.WIP && service) {
        for (let sn of ["sandwich1", "sandwich2", "sandwich3"]) {
            if (service[sn].username === c.sandwichUsername) {
                service[sn + "Busy"] = false;
                await service.save();
                break;
            }
        }
    }
}

async function price(data) {
    let price = 0;
    if (data.dish)
        price += (await models.Dish.findByPk(data.dish)).price;
    if (data.ingredient)
        for (let i of data.ingredient)
            price += (await models.Ingredient.findByPk(i)).price;
    if (data.sauce)
        for (let s of data.sauce)
            price += (await models.Sauce.findByPk(s)).price;
    if (data.drink)
        price += (await models.Drink.findByPk(data.drink)).price;
    if (data.dessert)
        price += (await models.Dessert.findByPk(data.dessert)).price;

    if (data.dish && data.ingredient && data.sauce && data.drink && data.dessert)
        price -= 0.3;
    return price;
}

module.exports.commandExport = commandExport;
module.exports.resetService = resetService;
module.exports.price = price;
