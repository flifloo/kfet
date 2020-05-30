const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
    if (req.session.user && req.cookies.userSId) {
        req.session.user = null;
        res.clearCookie("userSId");
    }
    res.redirect("/login");
});

module.exports = router;
