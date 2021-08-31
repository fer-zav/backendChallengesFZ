import express from 'express';
import Items from '../Items.js'
import {authCheck, unAuthPayload} from '../authCheck.js';

const prodEndpoints = express.Router();

// const productos = new Items();
const productos = new Items("Escuadra", "123.45", "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png");
const item2 = {title: "Calculadora", price: "234.56", thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-512.png"}
productos.addItem(item2);

const validateId = (id) => {
    return !isNaN(id) ?
        id >= 0 ?
            id < productos.getLastItemId() ?
                true
            : `Error: no se encontro ningun producto con ID "${id}"!`
        : "Error: ID de producto no puede ser < 0!"
    : `Error: "${id}" es NaN!`;
}

prodEndpoints.get("/", authCheck, (req, res) => {
    let payload = {}
    if (req.authUser || req.authAdmin){
        payload = {result: "Admin"}
    }else if (req.authUser){
        payload = {result: "User"}
    }else{
        payload = {result: "error", msg: "Acceso negado!"}
        res.status("500");
    }
    res.json(payload);
});

prodEndpoints.get(["/vista", "/views"], (req, res) => { /* conservado como tal por contener frontend */
    const getProds = () => {return {...productos}};
    res.render('main', {
        "productos": getProds(),
        "cant": productos.getLastItemId(),
        layout: "index",
    });
});

prodEndpoints.get(["/listar", "/list", "/listar/:id", "/list/:id"], authCheck, (req, res) => {
    let payload = {}
    if (req.authUser || req.authAdmin){
        const id = Number(req.params.id);
        if (productos.getItems().length > 0){
            if (!isNaN(id)){
                const result = validateId(id);
                if (typeof(result) !== "string"){
                    payload = {result: productos.getItem(id) ? productos.getItem(id) : `No hay productos con el id ${id}`}
                }else{
                    payload = {result: result}
                }
            }else{
                payload = {"result": productos.getItems()}
            }
        }else{
            payload = {"result": `Lista vacia!`}
        }
    }else{
        payload = {"result": unAuthPayload(req.originalUrl, req.method)}
    }
    res.json(payload);

});

prodEndpoints.get(["/guardar", "/save"], (req, res) => { //conservado como tal por contener frontend (intercambiado con "agregar/add")
    const getProds = () => {return {...productos}};
    res.render('form', {
        "productos": getProds(),
        "cant": productos.getLastItemId(),
        layout: "index",
    });
});

prodEndpoints.post(["/agregar", "/add"], authCheck, (req, res) => {
    let payload = {}
    const itemData = req.body;
    if (req.authAdmin){
        if (itemData?.title && itemData?.price && itemData?.thumbnail){
            productos.addItem(itemData);
            payload = {
                result: "Exito!",
                id: productos.getLastItemId() - 1,
                newProdcut: itemData,
            }
        }else{
            payload = {
                result: "Error: no se puede agregar un item invalido!",
                suppliedItem: itemData,
                validItemFormat: {
                    title: "exampleTitle",
                    price: "examplePrice",
                    thumbnail: "exampleThumbnail",
                }
            }
            res.status("500");
        }
    }else{
        payload = {"result": unAuthPayload(req.originalUrl, req.method)}
    }
    res.json(payload);
});

prodEndpoints.put(["/actualizar/:id", "/update/:id"], authCheck, (req, res) => {
    let payload = {}
    if (req.authAdmin){
        const itemId = Number(req.params.id);
        const itemData = req.body;
        if (itemData?.title && itemData?.price && itemData?.thumbnail){
            const result = validateId(itemId);
            if (typeof(result) !== "string"){
                payload = {result: productos.modificarItem(itemId, itemData)}
            }else{
                payload = {result: result}
            }
        }else{
            payload = {
                result: "Error: no se puede actualizar un item invalido!",
                suppliedItem: itemData,
                validItemFormat: {
                    title: "exampleTitle",
                    price: "examplePrice",
                    thumbnail: "exampleThumbnail",
                }
            }
        }
    }else{
        payload = {"result": unAuthPayload(req.originalUrl, req.method)}
    }
    res.json(payload);
});

prodEndpoints.delete(["/borrar", "/delete",  "/borrar/:id", "/delete/:id"], authCheck, (req, res) => {
    let payload = {}
    if (req.authAdmin){
        const itemId = Number(req.params.id);
        const result = validateId(itemId);
        if (typeof(result) !== "string" && typeof(productos.getItem(itemId)) !== "string"){
            payload = {result: productos.eliminarItem(itemId)}
        }else{
            payload = {result: result === true ? productos.getItem(itemId) : result}
        }
    }else{
        payload = {"result": unAuthPayload(req.originalUrl, req.method)}
    }
    res.json(payload);
});

export default prodEndpoints;
