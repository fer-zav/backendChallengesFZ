import express from 'express';
import Items from '../Items.js'

const endpoints = express.Router();

const productos = new Items("Escuadra", "123.45", "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png");
const item2 = {title: "Calculadora", price: "234.56", thumbnail: "https://cdn3.]iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-512.png"}
productos.addItem(item2);

const validateId = (id) => {
    return !isNaN(id) ?
        id >= 0 ?
            id < productos.getItems().length ?
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

endpoints.get("/productos/listar/", (req, res) => {
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

endpoints.post("/productos/guardar/", (req, res) => {
    const itemData = req.body;
    if (itemData?.title && itemData?.price && itemData?.thumbnail){
        productos.addItem(itemData);
        res.json({
            result: "Exito!",
            id: productos.getItems().length - 1,
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
    if (typeof(result) !== "string"){
        res.json({
            result: productos.eliminarItem(id),
        });
    }else{
        res.json({
            result: result,
        });
    }
});

export default endpoints;
