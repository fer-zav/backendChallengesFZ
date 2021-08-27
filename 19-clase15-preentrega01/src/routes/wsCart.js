import express from 'express';
import fs from "fs";
import {Cart} from '../Carrito.js'
import {authCheck, unAuthPayload} from '../authCheck.js';

const cartEndpoints = express.Router();
const carrito = Cart;

const carritoPlaceholder = [
    {
        id: 1,
        timestamp: new Date().getTime(),
        producto: {
            id: 1,
            nombre: "Escuadra",
            precio: "123.45",
            descripcion: "",
            codigo: "598f5ef3f0d31cfc6743f79614b0c56e", /*ringo*/
            foto: "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
            stock: 24,
            timestamp: new Date().getTime(),
        },
        quantity: 0,
    },
    {
        id: 2,
        timestamp: new Date().getTime(),
        producto: {
            id: 2,
            nombre: "Calculadora",
            precio: "234.56",
            descripcion: "",
            codigo: "52a43bc4333b63e5cd9e952357795054", /*gala*/
            foto: "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-512.png",
            stock: 65,
            timestamp: new Date().getTime(),
        },
        quantity: 0,
    },
    {
        id: 3,
        timestamp: new Date().getTime(),
        producto: {
            id: 3,
            nombre: "Globo Terraqueo",
            precio: "345.67",
            descripcion: "",
            codigo: "450af2b7bcba942959eb8ab81a587c23", /*witchero*/
            foto: "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-512.png",
            stock: 82,
            timestamp: new Date().getTime(),
        },
        quantity: 0,
    }
]
.forEach((c) => carrito.addItem(c));


const cartFile = "./cart.txt"
const carritoTemp = fs.readFileSync(cartFile, "utf-8");
const parseTmp = JSON.parse(carritoTemp.length > 0 ? carritoTemp : "{}");
// const llenarCarrito = parseTmp.carrito?.length > 0 ? parseTmp : {carrito: carrito};

cartEndpoints.get("/", authCheck, (req, res) => {
    if (req.authUser || req.authAdmin){
        res.json({
            result: "Admin",
        });
    }else if (req.authUser){
        res.json({
            result: "User",
        });
    }else{
        res.json({
            result: "error",
            msg: "un-auth!",
        });
    }
});

cartEndpoints.get(["/listar", "/list", "/listar/:id", "/list/:id"], authCheck, (req, res) => {
    if (req.authUser || req.authAdmin){
        const id = Number(req.params.id);
        if (id){
            res.json({
                result: `endpoint --> /listar/${id}|list/${id}`,
                carrito: carrito.getItems(),
                // result: result,
            });
        }else{
            res.json({
                result: `endpoint --> /listar|/list`,
                carrito: carrito.getItems(),
            })
        }
    }else{
        res.json(unAuthPayload(req.originalUrl, req.method));
    }
});

cartEndpoints.post(["/agregar", "/add"], authCheck, (req, res) => {
    if (req.authUser || req.authAdmin){
        res.json({
            result: `endpoint --> /agregar|/add`
        });
        // // console.log(req.headers.referer);
        // const itemData = req.body;
        // if (itemData?.title && itemData?.price && itemData?.thumbnail){
        //     productos.addItem(itemData);
        //     res.json({
        //         result: "Exito!",
        //         id: productos.getLastItemId() - 1,
        //         newProdcut: itemData,
        //     })
        // }else{
        //     res.json({
        //         result: "Error: no se puede agregar un item invalido!",
        //         suppliedItem: itemData,
        //         validItemFormat: {
        //             title: "exampleTitle",
        //             price: "examplePrice",
        //             thumbnail: "exampleThumbnail",
        //         }
        //     });
        // }
    }else{
        res.json(unAuthPayload(req.originalUrl, req.method));
    }
});

cartEndpoints.delete(["/borrar/:id", "/delete/:id"], (req, res) => {
    if (req.authUser || req.authAdmin){
        res.json({
            result: `endpoint --> /borrar/${id}|/delete/${id}`
        });
        // const id = Number(req.params.id);
        // const result = validateId(id);
        // if (typeof(result) !== "string" && typeof(productos.getItem(id)) !== "string"){ // tanto el resultado como el lookup del item son NO string, quiere decir que alguno de los 2 (o ambos) esta/n correcto/s
        //     res.json({
        //         result: productos.eliminarItem(id),
        //     });
        // }else{
        //     res.json({
        //         result: result === true ? productos.getItem(id) : result, // si result tiene algun "insight" ademas de true, imprimirlo, si no, el output de llamar a getItem con id no encontrado!
        //     });
        // }
    }else{
        res.json(unAuthPayload(req.originalUrl, req.method));
    }
});

export default cartEndpoints;