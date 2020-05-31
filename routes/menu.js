const express = require("express");
const router = express.Router();
const middleware = require("./middleware");

/* GET home page. */
router.get("/", middleware.sessionCheck, (req, res) => {
    res.render("menu", { title: "Kfet - Menu" });
});

module.exports = router;
