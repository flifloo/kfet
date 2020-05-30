const express = require("express");
const router = express.Router();
const models = require("../models");

/* GET home page. */
router.get("/", async (req, res) => {
    if (req.session.user && req.cookies.userSId)
        res.redirect("/")
    else
        res.render("login", { title: "Kfet - Login" });
})
    .post("/", async (req, res) => {
        if (!req.body.username || !req.body.password)
            res.redirect("/login");
        else {
            let u = await models.User.findByPk(req.body.username);
            if (!u || !u.passwordHash || require("crypto").createHash("sha256").update(u.username + req.body.password).digest("base64") !== u.passwordHash)
                res.redirect("/login?err=true");
            else {
                req.session.user = u;
                res.redirect("/");
            }
        }
    });

module.exports = router;
