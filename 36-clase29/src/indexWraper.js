import {args_parse} from "./config/args_parser.js";
import {exec} from "child_process";
import app from "./ej29.js";
import os from "os";

const cmdFork = `pm2 start ./src/indexWraper.js --name="serverFork" --watch -f`;
const cmdCluster = `pm2 start ./src/indexWraper.js --name="serverCluster" --watch -i 0 -f`;

const args = args_parse();
console.log(args)

if (args.mode === "cluster"){
    exec(cmdCluster, (err, stdout, stderr) => {
        if (err || stderr) {
            if (err) console.log(`ERROR err: ${err.message}`);
            if (stderr) console.log(`ERROR: ${stderr}`);
            return;
        }
        console.log(stdout);
        console.log(process.pid);
        app;
    })
}else{
    [...Array(os.cpus().length).keys()] // sin esto crea 1 solo proceso fork :think:
        .map((i) => {
            exec(cmdFork, (err, stdout, stderr) => {
                if (err || stderr) {
                    if (err) console.log(`ERROR err: ${err.message}`);
                    if (stderr) console.log(`ERROR: ${stderr}`);
                    return;
                }
                console.log(stdout);
                console.log(process.pid);
                app;
            });
        });
}
