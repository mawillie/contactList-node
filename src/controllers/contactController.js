const Contact = require("../models/ContactsModel");

module.exports.index = (req, res) => {
    res.render("contacts", {
        contact: {}
    });
};

module.exports.register = async (req, res) => {
    try {
        const user = req.session.user._id
        const contact = new Contact(req.body, user);
        await contact.register();

        if (contact.errors.length > 0) {
            req.flash("errors", contact.errors);
            req.session.save(() => res.redirect("back"));
            return;
        }

        req.flash("success", "Your contact was registered successfully");
        req.session.save(() =>
            res.redirect(`/contacts/index/${contact.contact._id}`)
        );
        return;
    } catch (e) {
        console.log(e);
        return res.render("404");
    }
};

module.exports.editIndex = async (req, res) => {
    if (!req.params.id) return res.render("404");

    try {
        const contact = await Contact.idSearch(req.params.id);
        res.render("contacts", { contact });
    } catch (e) {
        console.log(e);
        return res.render("404");
    }
};

module.exports.edit = async (req, res) => {
    if (!req.params.id) return res.render("404");

    try {
        const user = req.session.user._id
        const contact = new Contact(req.body, user);
        await contact.edit(req.params.id);

        if (contact.errors.length > 0) {
            req.flash("errors", contact.errors);
            req.session.save(() => res.redirect("back"));
            return;
        }

        req.flash("success", "Your contact was updated successfully");
        req.session.save(() =>
            res.redirect(`/contacts/index/${contact.contact._id}`)
        );
        return;
    } catch (e) {
        console.log(e);
        return res.render("404");
    }
};

module.exports.delete = async (req, res) => {
    if (!req.params.id) return res.render("404");

    const contato = await Contact.delete(req.params.id)

    req.flash('success', 'Contact deleted successfully')
    req.session.save(() => {
        res.redirect('back')
    })

};
