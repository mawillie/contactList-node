/* ======= REQUISIÇÕES ================ */
// DOTENV -> ARQUIVO IGNORADO PELO GIT PARA GUARDAR DADOS IMPORTANTES E CONFIDENCIAIS
require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

// MONGOOSE -> RESPONSÁVEL PELA MODELAGEM E CONECTAR A BASE DE DADOS
mongoose
    .connect(process.env.CONNECTIONURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Conectado a base de dados;");
        app.emit("OK");
    })
    .catch(e => console.log(e));

// SESSION -> SALVAR SESSÕES E COOKIES
const session = require("express-session");

// MONGOSTORE -> SALVA OS COOKIES DENTRO DA BASE DE DADOS
const MongoStore = require("connect-mongo");

// FLASH -> MENSAGENS RÁPIDAS E AUTO-DESTRUTIVAS (PRINTA E SE DELETA)
const flash = require("connect-flash");

const routes = require("./routes");
const path = require("path");
const csrf = require("csurf");
// const helmet = require("helmet");

// MIDDLEWARE -> FUNÇÕES QUE EXECUTAM NO MEIO DAS ROTAS
const {
    globalMiddle,
    checkCsrfError,
    csrfMiddle,
} = require("./src/middlewares/middleware");

/* ====== CONFIGURAÇÕES INICIAIS =============== */

// Helmet > Segurança | Desabilitar no localhost
// app.use(helmet());

// Permite que o request.body seja usado em um método post
app.use(express.urlencoded({ extended: true }));

// Apontando qual é a pasta public para utilizar arquivos estáticos
app.use(express.static(path.resolve(__dirname, "public")));

const sessionOptions = session({
    secret: "gato",
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONURL }),
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
        httpOnly: true
    }
});
app.use(sessionOptions);
app.use(flash());

// VIEWS -> Apontando onde estão os arquivos HTML
app.set("views", path.resolve(__dirname, "src", "views"));
app.set("view engine", "ejs");

/* ===== CSRF, ROUTES E MIDDLEWARES ==================== */

// Csurf > Segurança | Desabilitar no localhost
app.use(csrf());

// Middleware
app.use(checkCsrfError);
app.use(csrfMiddle);
app.use(globalMiddle);

// Permite que o servidor use as rotas
app.use(routes);

app.on("OK", () => {
    app.listen(3000, () => {
        console.log("ACESSAR HTTP://LOCALHOST:3000");
        console.log("SERVIDOR ON!");
    });
});
