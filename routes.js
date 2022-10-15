const express = require("express");
const route = express.Router();
const homeController = require("./src/controllers/homeController");
const signinController = require("./src/controllers/signinController");
const signupController = require("./src/controllers/signupController");
const logoutController = require('./src/controllers/logoutController')
const contactController = require('./src/controllers/contactController')

const { loginMiddle } = require('./src/middlewares/middleware')

// Rotas da home
route.get("/", homeController.index);

// Rotas de login
route.get("/signin", signinController.index);
route.get("/signup", signupController.index);

route.post("/signup/create", signupController.create);
route.post("/signin/login", signinController.signin);

route.get('/logout', logoutController.exit)


// Rotas de contato
route.get('/contacts/index', loginMiddle, contactController.index)
route.post('/contacts/register', contactController.register)
route.get("/contacts/index/:id",loginMiddle, contactController.editIndex);
route.post("/contacts/edit/:id",loginMiddle, contactController.edit);
route.get("/contacts/delete/:id", loginMiddle, contactController.delete)


module.exports = route;
