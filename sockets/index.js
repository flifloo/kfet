const listCommand = require("./list/listCommand");
const listDish = require("./list/listDish");
const listIngredient = require("./list/listIngredient");
const listSauce = require("./list/listSauce");
const listDrink = require("./list/listDrink");
const listDessert = require("./list/listDessert");
const listUser = require("./list/listUser");
const listService = require("./list/listService");
const addCommand = require("./add/addCommand");
const addUSer = require("./add/addUser");
const setDish = require("./set/setDish");
const setIngredient = require("./set/setIngredient");
const setSauce = require("./set/setSauce");
const setDrink = require("./set/setDrink");
const setDessert = require("./set/setDessert");
const setService = require("./set/setService");
const removeDish = require("./remove/removeDish");
const removeIngredient = require("./remove/removeIngredient");
const removeSauce = require("./remove/removeSauce");
const removeDrink = require("./remove/removeDrink");
const removeDessert = require("./remove/removeDessert");
const giveCommand = require("./giveCommand");
const WIPCommand = require("./WIPCommand");
const doneCommand = require("./doneCommand");
const errorCommand = require("./errorCommand");
const clearCommand = require("./clearCommand");
const price = require("./price")

module.exports = socket => {
    socket.on("list command", listCommand(socket));
    socket.on("list dish", listDish(socket));
    socket.on("list ingredient", listIngredient(socket));
    socket.on("list sauce", listSauce(socket));
    socket.on("list drink", listDrink(socket));
    socket.on("list dessert", listDessert(socket));
    socket.on("list user", listUser(socket));
    socket.on("list service", listService(socket));
    socket.on("add command", addCommand(socket));
    socket.on("add user", addUSer(socket));
    socket.on("set dish", setDish(socket));
    socket.on("set ingredient", setIngredient(socket));
    socket.on("set sauce", setSauce(socket));
    socket.on("set drink", setDrink(socket));
    socket.on("set dessert", setDessert(socket));
    socket.on("set service", setService(socket));
    socket.on("remove dish", removeDish(socket));
    socket.on("remove ingredient", removeIngredient(socket));
    socket.on("remove sauce", removeSauce(socket));
    socket.on("remove drink", removeDrink(socket));
    socket.on("remove dessert", removeDessert(socket));
    socket.on("give command", giveCommand(socket));
    socket.on("WIP command", WIPCommand(socket));
    socket.on("done command", doneCommand(socket));
    socket.on("error command", errorCommand(socket));
    socket.on("clear command", clearCommand(socket));
    socket.on("price", price(socket));
    console.log("New connection !");
    socket.emit("connected");
}
