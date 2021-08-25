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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const serverChecker = () => {
    const url = "127.0.0.1";
    const puerto = 8080;
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        const options = {
            hostname: url,
            port: puerto,
            path: '/api/productos/listar/',
            method: 'GET'
        };
        const req = http.request(options, res => {
            res.on('data', (d) => {
                process.stdout.write(d);
            });
            process.stdout.write("\n");
        });
        req.on('error', (error) => {
            console.error(error);
        })
            .end();
    }), 1000);
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        const options = {
            hostname: url,
            port: puerto,
            path: '/api/productos/listar/',
            method: 'GET'
        };
        const temp = options.path;
        for (let i = 0; i < 3; i++) {
            options.path = temp + i;
            const req = http.request(options, res => {
                res.on('data', (d) => {
                    process.stdout.write(d);
                });
                process.stdout.write("\n");
            });
            req.on('error', (error) => {
                console.error(error);
            })
                .end();
        }
    }), 1500);
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        const itemPayload = JSON.stringify({
            "title": "Globo Terraqueo",
            "price": "345.67",
            "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-512.png"
        });
        const options = {
            hostname: url,
            port: puerto,
            path: '/api/productos/guardar/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': itemPayload.length,
            },
        };
        const req = http.request(options, res => {
            res.on('data', (d) => {
                process.stdout.write(d);
            });
            process.stdout.write("\n");
        });
        req.on('error', (error) => {
            console.error(error);
        })
            .write(itemPayload);
    }), 2000);
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        const options = {
            hostname: url,
            port: puerto,
            path: '/api/productos/listar/',
            method: 'GET'
        };
        const req = http.request(options, res => {
            res.on('data', (d) => {
                process.stdout.write(d);
            });
            process.stdout.write("\n");
        });
        req.on('error', (error) => {
            console.error(error);
        })
            .end();
    }), 3000);
};
exports.default = serverChecker;
