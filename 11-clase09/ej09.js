import express from 'express';
import endpoints from "./routes/endpoints.js"
import serverChecker from './serverChecker.js';


const app = express();
const puerto = 8080;

const server = app.listen(puerto, () => {
    console.log(`Servidor HTTP escuchado @ puerto ${server.address().port}`);
});
server.on("error", (error) => console.log(`SERVER ERROR!: ${error}`));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api", endpoints);
app.use("/form", express.static('public'));

serverChecker();
