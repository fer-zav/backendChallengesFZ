import express from 'express';
import endpoints from "./routes/endpoints.js"
import serverChecker from './serverChecker.js';
import handlebars from 'express-handlebars';
import path from 'path';


const app = express();
const puerto = 8080;

const server = app.listen(puerto, () => {
    console.log(`Servidor HTTP escuchado @ puerto ${server.address().port}`);
});
server.on("error", (error) => console.log(`SERVER ERROR!: ${error}`));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const publicFolderPath = path.resolve("public");
app.use("/public", express.static(publicFolderPath));

const defaultLayerPath = path.resolve("./views/layouts/index.hbs");
const layoutFolderPath = path.resolve("./views/layouts");
const partialFolderPath = path.resolve("./views/partial");

app.engine("hbs", handlebars({
    extname: "hbs",
    defaultLayout: defaultLayerPath,
    layoutsDir: layoutFolderPath,
    partialsDir: partialFolderPath,
}));
app.set("view engine", "hbs");
app.set("views", "./views")

app.use("/api", endpoints);

serverChecker();
