import express from "express";
// import {fork} from "child_process";
import {args_parse} from "../config/args_parser.js";
import os from "os";
// import {randoms} from "./vanilla_fork.js"
// import path from "path";

const vanillaEndpoints = express.Router();
// const forkScript = path.resolve("./src/routes/vanilla_fork.js");

const randoms = (cant) => {
    const payload = [...Array(cant).keys()].map((i) => Math.ceil(Math.random() * 1000));
    const count = {}
    payload.map((i) => count[i] ? count[i] += 1 : count[i] = 1);
    return count;
}

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
    const cant = Number(req.query.cant) || parseInt(2**26.5754247591); //10e8 mata la ejecucion D", pero log(2, 10e7) funciona!
    const count = randoms(cant);
    res.json({
        PID: `${process.pid}`,
        msg: count,
        countCant: Object.entries(count).length,
        anotherCount: Object.entries(count).map((i) => i[1]).reduce((a, b) => a + b),
        howLong: `${new Date().getTime() - from} ms`,
    });

vanillaEndpoints.get("/killproc", (req, res) => {
    res.json({
        msg: `${process.pid} killed!`,
    });
    setTimeout(() => {
        process.exit(0);
    }, 1000);
});

    // const computo = fork(forkScript);
    // const computo = fork("./src/routes/vanilla_fork.js");
    // const msg = { msg: "start", cant: cant }; //todo esto roto "(
    // computo.send(msg);
    // computo.on("message", (msg) => {
    //     console.log(msg);
    //     res.json(msg);
    // });
});

export default vanillaEndpoints;
