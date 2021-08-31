import express from 'express';
import fs from "fs";
import {Cart} from '../Carrito.js'
import {authCheck, unAuthPayload} from '../authCheck.js';

const cartEndpoints = express.Router();
const carrito = Cart;
const cartFile = "./cart.txt"

const saveCart = (tempCart) => {
    const retrievedData = fs.readFileSync(cartFile, "utf-8");
    const payload = typeof(retrievedData) === "object" && retrievedData.carrito.length > 0 ? retrievedData : {"carrito": []}
    const parsedData = tempCart.showCart();
    parsedData.forEach((prod) => payload.carrito.push(prod));
    payload.carrito = parsedData;

    fs.truncateSync(cartFile, 0); // borrar el archivo
    let fd = fs.openSync(cartFile, "a");
    fs.writeFileSync(fd, JSON.stringify(payload), "utf-8")
    ?.catch((err) => {
        console.log("error escribiendo al archivo!", err)
    })
    ?.finally(() => {
        if (fd !== undefined){
            fs.closeSync(fd);
        }
    });
}

[
    {
        id: 0,
        timestamp: new Date().getTime(),
        producto: {
            id: 0,
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
        id: 1,
        timestamp: new Date().getTime(),
        producto: {
            id: 1,
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
        id: 2,
        timestamp: new Date().getTime(),
        producto: {
            id: 2,
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
].map((p) => carrito.populateCart(p));

const carritoTemp = fs.readFileSync(cartFile, "utf-8");
const parseCart = JSON.parse(typeof(carritoTemp) === "string" && carritoTemp.length > 2 ? carritoTemp : "{}");
[0, 1, 2].forEach((i) => carrito.addItem(i)); // agregando items de la lista al carrito, segun su id

carrito.getItems() < parseCart?.length ? carrito.swapCart(parseCart.carrito) : false; //checkeamos (safety first) e inicializamos el carrito populandolo con la data del archivo

cartEndpoints.get("/", authCheck, (req, res) => {
    let payload = {}
    if (req.authUser || req.authAdmin){
        payload = {result: "Admin"}
    }else if (req.authUser){
        payload = {result: "User"}
    }else{
        payload = {result: "Error", msg: "Acceso negado!"}
        res.status("500");
    }
    res.json(payload);
});

cartEndpoints.get(["/listar", "/list", "/listar/:id", "/list/:id"], authCheck, (req, res) => {
    let payload = {}
    if (req.authUser || req.authAdmin){
        const itemId = Number(req.params.id);
        if (carrito.showCart().length > 0){
            const tmpCart = carrito.getItems();
            if (!isNaN(itemId)){
                const item = tmpCart.filter((i) => i.id === itemId && i.quantity > 0);
                payload = {"result": item.length > 0 ? item : `No hay productos en el carrito con el id ${itemId}`}
            }else{
                payload = {"result": carrito.showCart()}
            }
        }else{
            payload = {"result": `Carrito vacio!`}
        }
    }else{
        payload = {"result": unAuthPayload(req.originalUrl, req.method)}
    }
    res.json(payload);
});

cartEndpoints.post(["/agregar", "/add", "/agregar/:id", "/add/:id"], authCheck, (req, res) => { //agregados "/agregar" y "/add" para poder darle un error custom
    let payload = {}
    if (req.authUser || req.authAdmin){
        const itemId = Number(req.params.id);
        if (!isNaN(itemId)){
            const added = carrito.addItem(itemId);
            if (added === true){
                payload = {"result": `item ${itemId} añadido exitosamente!`}
                saveCart(carrito);
            }else{
                payload = {"result": `error agregando producto: ${added}`}
                res.status("500");
            }
        }else{
            payload = {"result": `falta el id del producto a agregar al carrito`}
            res.status("500");
        }
    }else{
        payload = {"result": unAuthPayload(req.originalUrl, req.method)}
    }
    res.json(payload);
});

cartEndpoints.delete(["/borrar", "/delete", "/borrar/:id", "/delete/:id"], authCheck, (req, res) => {
    let payload = {}
    if (req.authUser || req.authAdmin){
        const itemId = Number(req.params.id);
        if (!isNaN(itemId)){
            const deleted = carrito.deleteItem(itemId);
            if (deleted === true){
                payload = {"result": `item ${itemId} eliminado exitosamente!`}
                saveCart(carrito);
            }else{
                payload = {"result": `error eliminando producto: ${deleted}`}
                res.status("500");
            }
        }else{
            payload = {"result": `falta el id del producto a eliminar del carrito`}
            res.status("500");
        }
    }else{
        payload = {"result": unAuthPayload(req.originalUrl, req.method)}
    }
    res.json(payload);
});

export default cartEndpoints;