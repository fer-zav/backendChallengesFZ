import express from "express";
import {fork} from "child_process";
import os from "os";
import path from "path";
import {args_parse} from "../config/args_parser.js";

const vanillaEndpoints = express.Router();
const forkScript = path.resolve("./src/routes/vanilla_fork.js");

const cantProcs = os.cpus().length;

vanillaEndpoints.get("/info", (req, res) => {
    res.json({
        msg: "Some this.nodeJS data!",
        args: Object.fromEntries(Object.entries(args_parse()).map((i) =>
            i[0].indexOf("FB") > -1
            ? [i[0], i[1].replace(/.*/, "...[redacted]...")]
            : i
        )),
        execPath: `${process.execPath}`,
        platform: `${process.platform}`,
        PID: `${process.pid}`,
        nodeVer: `${process.version}`,
        runningWorkers: cantProcs,
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
        res.json({...msg, howLong: `${new Date().getTime() - from} ms`,});
    });
});

vanillaEndpoints.get("/killproc", (req, res) => {
    res.json({
        msg: `${process.pid} killed!`,
    });
    setTimeout(() => {
        process.exit(0);
    }, 1000);
});

export default vanillaEndpoints;
