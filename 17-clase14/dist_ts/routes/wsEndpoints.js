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
const express = __importStar(require("express"));
const Items_js_1 = __importDefault(require("../Items.js"));
const endpoints = express.Router();
// const productos = new Items();
const productos = new Items_js_1.default("Escuadra", "123.45", "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png");
const item2 = { title: "Calculadora", price: "234.56", thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-512.png" };
productos.addItem(item2);
const validateId = (id) => {
    return !isNaN(id) ?
        id >= 0 ?
            id < productos.getLastItemId() ?
                true
                : `Error: no se encontro ningun producto con ID "${id}"!`
            : "Error: ID de producto no puede ser < 0!"
        : `Error: "${id}" es NaN!`;
};
endpoints.get("/", (req, res) => {
    res.json({
        result: "Endpoint inicial!",
    });
});
endpoints.get("/productos", (req, res) => {
    res.json({
        result: "endpoint index!",
        get: [
            { url: `http://${req.headers.host}/api/`, description: "endpoint inicial" },
            { url: `http://${req.headers.host}/api/productos`, description: "this" },
            { url: `http://${req.headers.host}/api/productos/vista`, description: "representacion visual de los productos" },
            { url: `http://${req.headers.host}/api/productos/listar`, description: "endpoint JSON de los productos" },
            { url: `http://${req.headers.host}/api/productos/listar/{id}`, description: "endpoint JSON de un producto especifico" },
            { url: `http://${req.headers.host}/api/productos/agregar`, description: "representacion visual para agregar un producto especifico" },
        ],
        post: [
            { url: `http://${req.headers.host}/api/productos/guardar`, description: "endpoint para agregar un producto especifico" },
        ],
        put: [
            { url: `http://${req.headers.host}/api/productos/actualizar/:id`, description: "endpoint para modificar un producto especifico" },
        ],
        delete: [
            { url: `http://${req.headers.host}/api/productos/borrar/:id`, description: "endpoint para eliminar un producto especifico" },
        ],
    });
});
endpoints.get("/productos/vista", (req, res) => {
    const getProds = () => { return Object.assign({}, productos); };
    res.render('main', {
        "productos": getProds(),
        "cant": productos.getLastItemId(),
        layout: "index",
    });
});
endpoints.get("/productos/listar", (req, res) => {
    if (productos.getItems()) {
        res.json({
            result: productos.getItems(),
        });
    }
    else {
        res.json({
            result: "Error: Lista de productos vacia!",
        });
    }
});
endpoints.get("/productos/listar/:id", (req, res) => {
    const id = Number(req.params.id);
    const result = validateId(id);
    if (typeof (result) !== "string") {
        res.json({
            result: productos.getItem(id),
        });
    }
    else {
        res.json({
            result: result,
        });
    }
});
endpoints.get("/productos/agregar", (req, res) => {
    const getProds = () => { return Object.assign({}, productos); };
    res.render('form', {
        "productos": getProds(),
        "cant": productos.getLastItemId(),
        layout: "index",
    });
});
endpoints.post("/productos/guardar", (req, res) => {
    // console.log(req.headers.referer);
    const itemData = req.body;
    if ((itemData === null || itemData === void 0 ? void 0 : itemData.title) && (itemData === null || itemData === void 0 ? void 0 : itemData.price) && (itemData === null || itemData === void 0 ? void 0 : itemData.thumbnail)) {
        productos.addItem(itemData);
        res.json({
            result: "Exito!",
            id: productos.getLastItemId() - 1,
            newProdcut: itemData,
        });
    }
    else {
        res.json({
            result: "Error: no se puede agregar un item invalido!",
            suppliedItem: itemData,
            validItemFormat: {
                title: "exampleTitle",
                price: "examplePrice",
                thumbnail: "exampleThumbnail",
            }
        });
    }
});
endpoints.put("/productos/actualizar/:id", (req, res) => {
    const id = Number(req.params.id);
    const itemData = req.body;
    if ((itemData === null || itemData === void 0 ? void 0 : itemData.title) && (itemData === null || itemData === void 0 ? void 0 : itemData.price) && (itemData === null || itemData === void 0 ? void 0 : itemData.thumbnail)) {
        const result = validateId(id);
        if (typeof (result) !== "string") {
            res.json({
                result: productos.modificarItem(id, itemData),
            });
        }
        else {
            res.json({
                result: result,
            });
        }
    }
    else {
        res.json({
            result: "Error: no se puede actualizar un item invalido!",
            suppliedItem: itemData,
            validItemFormat: {
                title: "exampleTitle",
                price: "examplePrice",
                thumbnail: "exampleThumbnail",
            }
        });
    }
});
endpoints.delete("/productos/borrar/:id", (req, res) => {
    const id = Number(req.params.id);
    const result = validateId(id);
    if (typeof (result) !== "string" && typeof (productos.getItem(id)) !== "string") { // tanto el resultado como el lookup del item son NO string, quiere decir que alguno de los 2 (o ambos) esta/n correcto/s
        res.json({
            result: productos.eliminarItem(id),
        });
    }
    else {
        res.json({
            result: result === true ? productos.getItem(id) : result, // si result tiene algun "insight" ademas de true, imprimirlo, si no, el output de llamar a getItem con id no encontrado!
        });
    }
});
exports.default = endpoints;
