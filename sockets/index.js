const listCommand = require("./listCommand");
const listDish = require("./listDish");
const listIngredient = require("./listIngredient");
const listSauce = require("./listSauce");
const listDrink = require("./listDrink");
const listDessert = require("./listDessert");
const listUser = require("./listUser");
const listService = require("./listService");
const addCommand = require("./addCommand");
const addUSer = require("./addUser");
const setDish = require("./setDish");
const setIngredient = require("./setIngredient");
const setSauce = require("./setSauce");
const setDrink = require("./setDrink");
const setDessert = require("./setDessert");
const setService = require("./setService");
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
    socket.on("give command", giveCommand(socket));
    socket.on("WIP command", WIPCommand(socket));
    socket.on("done command", doneCommand(socket));
    socket.on("error command", errorCommand(socket));
    socket.on("clear command", clearCommand(socket));
    socket.on("price", price(socket));
    console.log("New connection !");
    socket.emit("connected");
}
