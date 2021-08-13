import express from 'express';
import endpoints from "./routes/endpoints.js"
import serverChecker from './serverChecker.js';
import path from 'path';


const app = express();
const puerto = 8080;

const server = app.listen(puerto, () => {
    console.log(`Servidor HTTP escuchado @ puerto ${server.address().port}`);
});
server.on("error", (error) => console.log(`SERVER ERROR!: ${error}`));

const publicFolderPath = path.resolve("public");
app.use("/public", express.static(publicFolderPath));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// ejs config
app.set("views", "./views/ejs");
app.set("view engine", "ejs");

app.use("/api", endpoints);

serverChecker();
