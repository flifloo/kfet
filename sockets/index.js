const listCommand = require("./listCommand")
const listDish = require("./listDish")
const listIngredient = require("./listIngredient")
const listSauce = require("./listSauce")
const listDrink = require("./listDrink")
const listDessert = require("./listDessert")
const addCommand = require("./addCommand")

module.exports = socket => {
    socket.on("list command", listCommand(socket));
    socket.on("list dish", listDish(socket));
    socket.on("list ingredient", listIngredient(socket));
    socket.on("list sauce", listSauce(socket));
    socket.on("list drink", listDrink(socket));
    socket.on("list dessert", listDessert(socket));
    socket.on("list dessert", listDessert(socket));
    socket.on("add command", addCommand(socket));
    console.log("New connection !");
    socket.emit("connected");
}
