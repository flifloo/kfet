const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function(req, res) {
    res.render("commands", { title: "Kfet - Commands" });
});

module.exports = router;
