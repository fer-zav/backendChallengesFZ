import express from "express";
import endpoints from "./routes/wsEndpoints.js"
import * as path from 'path';
import * as http from "http";
import {Begin} from "./libws.js";
import serverChecker from './serverChecker.js';


const app = express();
const puerto = 8080;

const publicFolderPath = path.resolve(__dirname, "public");
app.use("/public", express.static(publicFolderPath));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set("views", "./views");
app.set("view engine", "ejs");

app.use("/api", endpoints);

const server = new http.Server(app);
server.listen(puerto, () =>
    console.log(`Servidor HTTP escuchado @ puerto ${server.address()}`)
)
.on("error", (error: any) => console.log(`SERVER ERROR!: ${error}`));

const wsServer = Begin(server);
wsServer.on("error", (error: any) => console.log(`SERVER ERROR!: ${error}`));

serverChecker();
