function commandExport (c ) {
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

function resetService(c, service) {
    if (c.WIP && service) {
        let sandwiches = [service.sandwich1Id, service.sandwich2Id, service.sandwich3Id]
        if (c.sandwichId in sandwiches)
            service["sandwich"+sandwiches.indexOf(c.sandwichId)+1] = false;
    }
}

module.exports.commandExport = commandExport;
module.exports.resetService = resetService;
