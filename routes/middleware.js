function sessionCheck(req, res, next) {
    if (!req.session.user || !req.cookies.userSId)
        res.redirect("/login");
    else
        next();
}

module.exports.sessionCheck = sessionCheck;