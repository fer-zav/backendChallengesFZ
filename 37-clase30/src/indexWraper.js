import {args_parse} from "./config/args_parser.js";
import {exec} from "child_process";
import app from "./ej30.js";

const cmdFork = `pm2 start ./src/ej30.js --name=serverFork --watch -f -- 8080`;
const cmdCluster = `pm2 start ./src/ej30.js --name=serverCluster --watch -i 0 -f -- 8081`;

const args = args_parse();
console.log(args)

const execWrap = (arg) => {
    exec(arg, (err, stdout, stderr) => {
        if (err || stderr) {
            if (err) console.log(`ERROR err: ${err.message}`);
            if (stderr) console.log(`ERROR: ${stderr}`);
            return;
        }
        console.log(stdout);
        console.log(process.pid);
        app;
    });
}

(() => {args.mode === "cluster" ? execWrap(cmdCluster) : execWrap(cmdFork)})();
