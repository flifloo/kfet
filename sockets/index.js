const listCommand = require("./listCommand");
const listDish = require("./listDish");
const listIngredient = require("./listIngredient");
const listSauce = require("./listSauce");
const listDrink = require("./listDrink");
const listDessert = require("./listDessert");
const listUser = require("./listUser");
const addCommand = require("./addCommand");
const addUSer = require("./addUser")
const giveCommand = require("./giveCommand");
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
    socket.on("list dessert", listDessert(socket));
    socket.on("list user", listUser(socket));
    socket.on("add command", addCommand(socket));
    socket.on("add user", addUSer(socket));
    socket.on("give command", giveCommand(socket));
    socket.on("error command", errorCommand(socket));
    socket.on("clear command", clearCommand(socket));
    socket.on("price", price(socket));
    console.log("New connection !");
    socket.emit("connected");
}
