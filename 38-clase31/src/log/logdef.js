import log4js from "log4js";

log4js.configure({
    appenders: {
        logConsole: {type: "console"},
        logWarn: {type: "file", filename: "./logs/warn.log"},
        logError: {type: "file", filename: "./logs/error.log"}
    },
    categories: {
        default: {appenders: ["logConsole"], level: "info"},
        console: {appenders: ["logConsole"], level: "trace"},
        file1: {appenders: ["logWarn"], level: "warn"},
        file2: {appenders: ["logError"], level: "error"}
    }
});

const logger = log4js.getLogger();
// logger.level = 'debug'; //queremos trace aca!
const warnLogger = log4js.getLogger("file1");
const errorLogger = log4js.getLogger("file2");

export default {console: logger, warn: warnLogger, error: errorLogger};
