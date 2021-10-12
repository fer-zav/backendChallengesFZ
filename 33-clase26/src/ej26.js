import express from "express";
import session from "express-session";
import path from 'path';
import * as http from "http";
import MongoStore from "connect-mongo";
import passport, {isLoggedIn} from "./middlewares/userLocalAuth.js";
import {Config} from "./config/config.js";
import prodEndpoints from "./routes/wsEndpoints.js"
import cartEndpoints from "./routes/wsCart.js";
import authEndpoints from "./routes/localAuthEndpoint.js";
import userEndpoints from "./routes/usersEndpoint.js";
import {Begin} from "./libws.js";
import serverChecker from './serverChecker.js';

const app = express();
const puerto = process.env.PORT || 8080;

const publicFolderPath = path.resolve("public");
app.use("/public", express.static(publicFolderPath));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 1000 * 60 * 10,
    },
    store: MongoStore.create({
        mongoUrl: "mongodb://localhost:27017/ecommerce",//`mongodb+srv://${Config.MONGO_ATLAS_USER}:${Config.MONGO_ATLAS_PASSWORD}@${Config.MONGO_ATLAS_CLUSTER}/${Config.MONGO_ATLAS_DBNAME}?retryWrites=true&w=majority`,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    }),
    secret: Config.SESSION_SECRET,
    rolling: true,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    /* https://www.youtube.com/watch?v=fGrSmBk9v-4 */
    // req.session ? console.log(`REQ.SESSION =>\n${JSON.stringify(req.session)}`) : false;
    // req.body ? console.log(`req.body: ${JSON.stringify(req.body)}`) : false;
    // req.user ? console.log(`REQ.USER =>\n${JSON.stringify(req.user)}`) : false;
    // req.isAuthenticated() ? console.log(`REQ.AUTHENTICATE =>\n${JSON.stringify(req.isAuthenticated())}`) : false;
    next();
});

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(["/productos", "/products"], prodEndpoints);
app.use(["/carrito", "/cart"], cartEndpoints);
app.use("/auth", authEndpoints);
app.use(["/usuarios", "/users"], isLoggedIn, userEndpoints);

const server = http.Server(app);
server.listen(puerto, () =>
    console.log(`Servidor HTTP escuchado @ puerto ${server.address().port}`)
)
.on("error", (error) => console.log(`SERVER ERROR!: ${error}`));

const wsServer = Begin(server);
wsServer.on("error", (error) => console.log(`SERVER ERROR!: ${error}`));

serverChecker(puerto);
