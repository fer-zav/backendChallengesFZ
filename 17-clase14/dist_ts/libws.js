"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Begin = void 0;
const Items_js_1 = __importDefault(require("./Items.js"));
const socket_io_1 = require("socket.io");
const fs = __importStar(require("fs"));
const Begin = (app) => {
    var _a;
    const io = new socket_io_1.Server(app);
    const productos = new Items_js_1.default();
    const msgsFile = "./messages.txt";
    const tmpMsgs = fs.readFileSync(msgsFile, "utf-8");
    const parseTmp = JSON.parse(tmpMsgs.length > 0 ? tmpMsgs : "{}");
    const mensajes = ((_a = parseTmp.messages) === null || _a === void 0 ? void 0 : _a.length) > 0 ? parseTmp : { messages: [{ auth: "yo", text: "placeholder initial msg", date: new Date().getTime() }] };
    io.on("connection", (socket) => {
        socket.on("add_prods", (p) => {
            productos.addItem(p);
            io.emit('list_update', productos.getItems()[productos.getItems().length - 1]);
        });
        socket.on('start_prods', () => {
            const prods = productos.getItems();
            if (prods.length > 0) {
                socket.emit("list_init", prods);
            }
            socket.emit("messages_init", mensajes.messages);
            // socket.emit("mostrar_txt_file", mensajes.messages); //descomentar para emitir "mostrar_txt_file", del ws_main y mostrar asi el contenido del txt en el browser
        });
        socket.on("new_message", (msg) => {
            mensajes.messages.push(msg);
            io.emit("push_new_message", JSON.stringify(mensajes.messages));
            fs.truncateSync(msgsFile, 0); // borrar el archivo
            let fd = fs.openSync(msgsFile, "a");
            try {
                fs.writeFileSync(fd, JSON.stringify(mensajes), "utf-8");
            }
            catch (_a) {
                console.log("error writing message data!");
            }
            finally {
                if (fd !== undefined) {
                    fs.closeSync(fd);
                }
            }
        });
    });
    return io;
};
exports.Begin = Begin;
