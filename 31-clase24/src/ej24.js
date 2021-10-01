import express from "express";
import prodEndpoints from "./routes/wsEndpoints.js"
import cartEndpoints from "./routes/wsCart.js";
import path from 'path';
import * as http from "http";
import {Begin} from "./libws.js";
import serverChecker from './serverChecker.js';

const app = express();
const puerto = process.env.PORT || 8080;

const publicFolderPath = path.resolve("public");
app.use("/public", express.static(publicFolderPath));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(["/productos", "/products"], prodEndpoints);
app.use(["/carrito", "/cart"], cartEndpoints);

const server = http.Server(app);
server.listen(puerto, () =>
    console.log(`Servidor HTTP escuchado @ puerto ${server.address().port}`)
)
.on("error", (error) => console.log(`SERVER ERROR!: ${error}`));

const wsServer = Begin(server);
wsServer.on("error", (error) => console.log(`SERVER ERROR!: ${error}`));

serverChecker(puerto);
