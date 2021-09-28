import express from "express";
import path from "path";
import * as http from "http";
import apiRouter from "../routes/index.js";

const app = express();

const publicFolderPath = path.resolve("../../public");
app.use(express.static(publicFolderPath));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/api", apiRouter);

app.set("views", "../../views");
app.set("view engine", "ejs");

//https://stackoverflow.com/questions/50218878/typescript-express-error-function // "prestadisimo" jaja
const errorHandler = (err, req, res, next) => {
    console.log(`HUBO UN ERROR ${err}`);
    res.status(500).json({
        err: err.message,
    });
};

app.use(errorHandler);
const myServer = new http.Server(app);
myServer.on("error", (error) => console.log(`SERVER ERROR!: ${error}`));

export default myServer;
