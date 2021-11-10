import express from "express";
import path from "path";
import * as http from "http";
import compression from "compression";
import passport, {isLoggedIn} from "./middlewares/userLocalAuth.js";
// import passport, {isLoggedIn} from "./middlewares/userFbAuth.js";
import {args_parse} from "./config/args_parser.js";
import * as logger from "./log/logdef.js";
import prodEndpoints from "./routes/wsEndpoints.js"
import cartEndpoints from "./routes/wsCart.js";
import authEndpoints from "./routes/localAuthEndpoint.js";
import userEndpoints from "./routes/usersEndpoint.js";
import vanillaEndpoints from "./routes/vanillaEndpoints.js";
import {Begin} from "./libws.js";
import serverChecker from "./serverChecker.js";
import {fbAuthOptions, localAuthOptions} from "./config/passportOptions.js";

const app = express();
const puerto = args_parse().puerto || process.env.PORT || 8080; // solo funciona desde node ./src/ej28.js, NO con nodemon
const [consola, logWarn, logError] = [logger.default.console, logger.default.warn, logger.default.error];

const publicFolderPath = path.resolve("public");
app.use("/public", express.static(publicFolderPath));
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
true ? app.use(fbAuthOptions) : app.use(localAuthOptions); // true = fb, false = local

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

app.use("/", vanillaEndpoints);
app.use(["/productos", "/products"], prodEndpoints);
app.use(["/carrito", "/cart"], cartEndpoints);
app.use("/auth", authEndpoints);
app.use(["/usuarios", "/users"], isLoggedIn, userEndpoints);

const server = http.Server(app);
server.listen(puerto, () =>
    consola.info(`Servidor HTTP escuchado @ puerto ${server.address().port}`)
)
.on("error", (error) => {
    logError.error(`SERVER ERROR!: ${error}`);
    consola.error(`SERVER ERROR!: ${error}`);
});

const wsServer = Begin(server);
wsServer.on("error", (error) => {
    logError.error(`SERVER ERROR!: ${error}`);
    consola.error(`SERVER ERROR!: ${error}`);
});

process.on("beforeExit", (code) => {
    consola.debug(`Process is ending with code "${code}"`);
    logWarn.debug(`Process is ending with code "${code}"`);
});
process.on("exit", (code) => {
    consola.debug(`Process ended with code "${code}"`);
    logWarn.debug(`Process ended with code "${code}"`);
});

serverChecker(puerto);

export default app;
