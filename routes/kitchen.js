const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function(req, res) {
    res.render("kitchen", { title: "Kfet - Kitchen" });
});

module.exports = router;
