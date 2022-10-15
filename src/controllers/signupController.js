const Login = require("../models/loginModel");

module.exports.index = (req, res) => {
    if (req.session.user) return res.render("logado");

    return res.render("signup");
};

module.exports.create = async (req, res) => {
    try {
        const login = new Login(req.body);
        await login.register();

        if (login.errors.length > 0) {
            req.flash("errors", login.errors);
            req.session.save(() => {
                return res.redirect("back");
            });
            return;
        }

        req.flash("success", "User created successfully");
        req.session.save(() => {
            return res.redirect("back");
        });
    } catch (e) {
        console.error(e);
        return res.render("404");
    }
};
