import * as express from 'express';
import Items from '../Items.js'

const endpoints = express.Router();

// const productos = new Items();
const productos = new Items("Escuadra", "123.45", "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png");
const item2 = {title: "Calculadora", price: "234.56", thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-512.png"}
productos.addItem(item2);

const validateId = (id: number) => {
    return !isNaN(id) ?
        id >= 0 ?
            id < productos.getLastItemId() ?
                true
            : `Error: no se encontro ningun producto con ID "${id}"!`
        : "Error: ID de producto no puede ser < 0!"
    : `Error: "${id}" es NaN!`;
}

endpoints.get("/", (req, res) => {
    res.json({
        result: "Endpoint inicial!",
    });
});

endpoints.get("/productos", (req, res) => {
    res.json({
        result: "endpoint index!",
        get: [
            {url: `http://${req.headers.host}/api/`, description: "endpoint inicial"},
            {url: `http://${req.headers.host}/api/productos`, description: "this"},
            {url: `http://${req.headers.host}/api/productos/vista`, description: "representacion visual de los productos"},
            {url: `http://${req.headers.host}/api/productos/listar`, description: "endpoint JSON de los productos"},
            {url: `http://${req.headers.host}/api/productos/listar/{id}`, description: "endpoint JSON de un producto especifico"},
            {url: `http://${req.headers.host}/api/productos/agregar`, description: "representacion visual para agregar un producto especifico"},
        ],
        post: [
            {url: `http://${req.headers.host}/api/productos/guardar`, description: "endpoint para agregar un producto especifico"},
        ],
        put: [
            {url: `http://${req.headers.host}/api/productos/actualizar/:id`, description: "endpoint para modificar un producto especifico"},
        ],
        delete: [
            {url: `http://${req.headers.host}/api/productos/borrar/:id`, description: "endpoint para eliminar un producto especifico"},
        ],
    })
});

endpoints.get("/productos/vista", (req, res) => {
    const getProds = () => {return {...productos}};
    res.render('main', {
        "productos": getProds(),
        "cant": productos.getLastItemId(),
        layout: "index",
    });
});

endpoints.get("/productos/listar", (req, res) => {
    if (productos.getItems()){
        res.json({
            result: productos.getItems(),
        });
    }else{
        res.json({
            result: "Error: Lista de productos vacia!",
        });
    }
});

endpoints.get("/productos/listar/:id", (req, res) => {
    const id = Number(req.params.id);
    const result = validateId(id);
    if (typeof(result) !== "string"){
        res.json({
            result: productos.getItem(id),
        });
    }else{
        res.json({
            result: result,
        });
    }
});

endpoints.get("/productos/agregar", (req, res) => {
    const getProds = () => {return {...productos}};
    res.render('form', {
        "productos": getProds(),
        "cant": productos.getLastItemId(),
        layout: "index",
    });
});

endpoints.post("/productos/guardar", (req, res) => {
    // console.log(req.headers.referer);
    const itemData = req.body;
    if (itemData?.title && itemData?.price && itemData?.thumbnail){
        productos.addItem(itemData);
        res.json({
            result: "Exito!",
            id: productos.getLastItemId() - 1,
            newProdcut: itemData,
        })
    }else{
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
    if (itemData?.title && itemData?.price && itemData?.thumbnail){
        const result = validateId(id);
        if (typeof(result) !== "string"){
            res.json({
                result: productos.modificarItem(id, itemData),
            });
        }else{
            res.json({
                result: result,
            });
        }
    }else{
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
    if (typeof(result) !== "string" && typeof(productos.getItem(id)) !== "string"){ // tanto el resultado como el lookup del item son NO string, quiere decir que alguno de los 2 (o ambos) esta/n correcto/s
        res.json({
            result: productos.eliminarItem(id),
        });
    }else{
        res.json({
            result: result === true ? productos.getItem(id) : result, // si result tiene algun "insight" ademas de true, imprimirlo, si no, el output de llamar a getItem con id no encontrado!
        });
    }
});

export default endpoints;
