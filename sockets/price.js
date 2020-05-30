const utils = require("./utils");

module.exports = socket => {
    return async (data) => {
        try {
            socket.emit("price", await utils.price(data));
        } catch (e) {
            socket.emit("internal error");
            console.error(e);
        }
    }
}
