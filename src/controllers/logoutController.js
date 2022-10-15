module.exports.exit = (req, res) => {
    req.session.destroy();
    res.redirect("/");
};
