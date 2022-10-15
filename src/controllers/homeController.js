const Contact = require('../models/ContactsModel')

exports.index = async (request, response, next) => {
    const user = request.session.user
    const contacts = await Contact.contactSearch(user)
    response.render("index", {contacts});
};

