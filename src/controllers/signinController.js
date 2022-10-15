const Login = require("../models/loginModel");

module.exports.index = (req, res) => {
    if (req.session.user) return res.render("logado");

    return res.render("signin");
};

module.exports.signin = async (req, res) => {
    try {
        const login = new Login(req.body);
        await login.login();

        if (login.errors.length > 0) {
            req.flash("errors", login.errors);
            req.session.save(() => {
                return res.redirect("back");
            });
            return;
        }

        req.flash("success", "Logado com sucesso");
        req.session.user = login.user;

        req.session.save(() => {
            return res.redirect("back");
        });
    } catch (e) {
        console.error(e);
        return res.render("404");
    }
};
