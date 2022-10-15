// const { render } = require("ejs")

module.exports.globalMiddle = (req, res, next) => {
    res.locals.errors = req.flash("errors");
    res.locals.success = req.flash("success");
    res.locals.user = req.session.user;


    next();
};

module.exports.checkCsrfError = (err, req, res, next) => {
    if (err) {
        return res.render("404");
    }

    next();
};

module.exports.csrfMiddle = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
};

module.exports.loginMiddle = (req, res, next) => {
    if (!req.session.user) {
        req.flash("errors", "You need to login to continue");
        req.session.save(() => {
            res.redirect("back");
        });
        return;
    }

    next()
};
