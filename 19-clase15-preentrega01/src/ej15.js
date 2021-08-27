import express from "express";
import prodEndpoints from "./routes/wsProductos.js"
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

app.use((req, res) => {
    console.log("\n404 capturado!");
    console.log(res.req.headers.host + res.req.originalUrl);
    res.status(404)
    // .json({result: "404: Page Not Found!"}); // esta explotando, parece que todas las urls caen aca A PESAR de tener una ruta... :shrug:
});

app.use((err, req, res) => {
    console.error(err.stack);
    console.log(res.req.headers.host + res.req.originalUrl);
    res.status(500)
    .json({result: "500: Internal Server Error!"});
})


const server = http.Server(app);
server.listen(puerto, () => console.log(`Servidor HTTP escuchado @ puerto ${server.address().port}`))
.on("error", (error) => console.log(`SERVER ERROR!: ${error}`));

const wsServer = Begin(server);
wsServer.on("error", (error) => console.log(`SERVER ERROR!: ${error}`));

serverChecker();
