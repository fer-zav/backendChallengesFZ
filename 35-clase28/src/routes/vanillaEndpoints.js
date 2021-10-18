import express from "express";
import {fork} from "child_process";
import {args_parse} from "../config/args_parser.js";
// import {randoms} from "./vanilla_fork.js"
import path from "path";

const vanillaEndpoints = express.Router();
// const forkScript = path.resolve("./src/routes/vanilla_fork.js");

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
    // const computo = fork(forkScript);
    const computo = fork("./src/routes/vanilla_fork.js");
    const cant = Number(req.query.cant) || parseInt(2**26.5754247591); //10e8 mata la ejecucion D", pero log(2, 10e7) funciona!
    const msg = { msg: "start", cant: cant };
    computo.send(msg);
    computo.on("message", (msg) => {
        console.log(msg);
        res.json(msg);
    });
    // res.json({
    //     // msg: count,
    //     // countCant: Object.entries(count).length,
    //     // anotherCount: Object.entries(count).map((i) => i[1]).reduce((a, b) => a + b),
    //     howLong: `${new Date().getTime() - from} ms`,
    // });
});

export default vanillaEndpoints;

// version bloqueante, funcional :facepalm:
/*
import express from "express";
import {args_parse} from "../config/args_parser.js";

const vanillaEndpoints = express.Router();

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
    const cant = Number(req.query.cant) || parseInt(2**26.5754247591); //10e8 mata la ejecucion D", pero log(2, 10e7) funciona!
    const payload = [...Array(cant).keys()].map((i) => Math.ceil(Math.random() * 1000));
    const count = {}
    payload.map((i) => count[i] ? count[i] += 1 : count[i] = 1);
    res.json({
        msg: count,
        countCant: Object.entries(count).length,
        anotherCount: Object.entries(count).map((i) => i[1]).reduce((a, b) => a + b),
        howLong: `${new Date().getTime() - from} ms`,
    });
});

export default vanillaEndpoints;
*/