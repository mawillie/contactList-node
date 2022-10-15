const mongoose = require("mongoose");
const validator = require("validator");

const ContactsSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: false, default: "" },
    email: { type: String, required: false, default: "" },
    phone: { type: String, required: false, default: "" },
    creationDate: { type: Date, default: Date.now },
    createdBy: {type: String }
});

const ContactsModel = mongoose.model("Contacts", ContactsSchema);

class Contacts {
    constructor(body, user = "") {
        this.user = user
        this.body = body;
        this.errors = [];
        this.contact = null;
    }

    async register() {
        this.validate();

        if (this.errors.length > 0) return;
        this.contact = await ContactsModel.create(this.body);
    }

    async edit(id) {
        if (typeof id !== 'string') return;
        this.validate()

        if (this.errors.length > 0) return;

        // Realizar uma verificação de que o contato realmente é da pessoa que está editando
        //
        //

        this.contact = await ContactsModel.findByIdAndUpdate(id, this.body)
    }

    static async contactSearch(user) {
        const contact = await ContactsModel.find({createdBy: user}).sort({creationDate: -1})
        return contact
    }

    static async delete(id) {
        if (typeof id !== 'string' ) return;

        const contact = await ContactsModel.findByIdAndDelete(id);
        return contact

    }

    static async idSearch(id) {
        if (typeof id !== 'string') return;
        const contact = await ContactsModel.findById(id)
        return contact
    }

    validate() {
        this.cleanUp();

        if (!this.body.firstname) {
            this.errors.push("Name is a required field");
        }

        if (!this.body.email && !this.body.phone) {
            this.errors.push("At least one contact type is required");
        }

        if (this.body.email) {
            if (!validator.isEmail(this.body.email)) {
                this.errors.push("Invalid e-mail");
            }
        }
    }

    cleanUp() {
        Object.keys(this.body).forEach(key => {
            if (typeof this.body[key] !== "string") {
                this.body[key] = "";
            }
        });

        this.body = {
            firstname: this.body.firstname,
            lastname: this.body.lastname,
            email: this.body.email,
            phone: this.body.phone,
            createdBy: this.user
        };
    }



}

module.exports = Contacts;
