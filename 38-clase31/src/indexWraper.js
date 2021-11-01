import {args_parse} from "./config/args_parser.js";
import {exec} from "child_process";
import app from "./ej30.js";
import * as logger from "./log/logdef.js";


const cmdFork = `pm2 start ./src/ej30.js --name=serverFork --watch -f -- 8080`;
const cmdCluster = `pm2 start ./src/ej30.js --name=serverCluster --watch -i 0 -f -- 8081`;
const [consola, logWarn, logError] = [logger.default.console, logger.default.warn, logger.default.error];

const args = args_parse();
consola.info(args)

const execWrap = (arg) => {
    exec(arg, (err, stdout, stderr) => {
        if (err || stderr) {
            if (err) logError.error(`ERROR err: ${err.message}`);
            if (stderr) logError.error(`ERROR: ${stderr}`);
            return;
        }
        consola.info(stdout);
        consola.info(process.pid);
        app;
    });
}

(() => {args.mode === "cluster" ? execWrap(cmdCluster) : execWrap(cmdFork)})();
