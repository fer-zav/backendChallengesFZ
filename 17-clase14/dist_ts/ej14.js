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
const express_1 = __importDefault(require("express"));
const wsEndpoints_js_1 = __importDefault(require("./routes/wsEndpoints.js"));
const path = __importStar(require("path"));
const http = __importStar(require("http"));
const libws_js_1 = require("./libws.js");
const serverChecker_js_1 = __importDefault(require("./serverChecker.js"));
const app = express_1.default();
const puerto = 8080;
const publicFolderPath = path.resolve(__dirname, "public");
app.use("/public", express_1.default.static(publicFolderPath));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.set("views", "./views");
app.set("view engine", "ejs");
app.use("/api", wsEndpoints_js_1.default);
const server = new http.Server(app);
server.listen(puerto, () => console.log(`Servidor HTTP escuchado @ puerto ${server.address()}`))
    .on("error", (error) => console.log(`SERVER ERROR!: ${error}`));
const wsServer = libws_js_1.Begin(server);
wsServer.on("error", (error) => console.log(`SERVER ERROR!: ${error}`));
serverChecker_js_1.default();
