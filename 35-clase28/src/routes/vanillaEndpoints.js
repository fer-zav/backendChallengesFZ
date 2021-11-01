import express from "express";
import {fork} from "child_process";
import {args_parse} from "../config/args_parser.js";
import path from "path";

const vanillaEndpoints = express.Router();
const forkScript = path.resolve("./src/routes/vanilla_fork.js");

vanillaEndpoints.get("/info", (req, res) => {
    res.json({
        msg: "Some this.nodeJS data!",
        args: args_parse(),
        execPath: `${process.execPath}`,
        platform: `${process.platform}`,
        PID: `${process.pid}`,
        nodeVer: `${process.version}`,
        currentWorkingDirectory: `${process.cwd()}`,
        currentMemoryUsage: process.memoryUsage(),
    });
});

vanillaEndpoints.get("/randoms:cant?", (req, res) => {
    const from = new Date().getTime();
    const computo = fork(forkScript);
    const cant = Number(req.query.cant) || parseInt(2**26.5754247591); //10e8 mata la ejecucion D", pero log(2, 10e7) funciona!
    const msg = { msg: "start", cant: cant };
    computo.send(msg);
    computo.on("message", (msg) => {
        res.json({
            PID: `${process.pid}`,
            ...msg,
            howLong: `${new Date().getTime() - from} ms`,
        });
    });
});

export default vanillaEndpoints;
