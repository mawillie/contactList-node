const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const loginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const loginModel = mongoose.model("login", loginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async login() {
        this.validate()
        if (this.errors.length > 0) return;
        this.user = await loginModel.findOne({ email: this.body.email })

        if (!this.user) {
            this.errors.push('User doesn\'t exist')
            return;
        } 

        if (!bcrypt.compareSync(this.body.password, this.user.password)) {
            this.errors.push('Invalid password')
            this.user = null
            return;
        }
    }

    async register() {
        this.validate();
        await this.userExists();

        if (this.errors.length > 0) return;

        const salt = bcrypt.genSaltSync();
        this.body.password = bcrypt.hashSync(this.body.password, salt);


        this.user = await loginModel.create(this.body);

    }

    async userExists() {
        this.user = await loginModel.findOne({ email: this.body.email });
        
        if (this.user) this.errors.push('User already exist')
    }

    validate() {
        this.cleanUp();

        if (!validator.isEmail(this.body.email)) {
            this.errors.push("Invalid e-mail");
        }

        if (this.body.password.length < 4 || this.body.password.length > 20) {
            this.errors.push("Password must be between 4 and 20 characters");
        }
    }

    cleanUp() {
        Object.keys(this.body).forEach(key => {
            if (typeof this.body[key] !== "string") {
                this.body[key] = "";
            }
        });

        this.body = {
            email: this.body.email,
            password: this.body.password
        };
    }
}

module.exports = Login;
