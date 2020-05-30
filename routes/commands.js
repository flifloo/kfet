const express = require("express");
const router = express.Router();
const middleware = require("./middleware");

/* GET home page. */
router.get("/", middleware.sessionCheck, (req, res) => {
    res.render("commands", { title: "Kfet - Commands" });
});

module.exports = router;
