import express from 'express';
import {ProdsDBService} from '../db/utils/prodsDbHandler.js';

const cartEndpoints = express.Router();

const tableName = "productos";
const prodsdb = (() => { //auto-ejecutada, inicializa la db
    const prodsdb = ProdsDBService;
    prodsdb.init(tableName);
    return prodsdb
})();

cartEndpoints.get("/", (req, res) => {
    res.json({
        result: "Endpoint inicial!",
    });
});

cartEndpoints.get(["/listar", "/list", "/listar/:id", "/list/:id"], async (req, res) => {
    let payload = {}
    const itemId = Number(req.params.id);
    const cartContent = prodsdb.get(tableName);
    const cartItems = await cartContent.then((r) => r);
    if (cartItems.length > 0){
        if (!isNaN(itemId)){
            const item = await cartContent.where("id", itemId).then((r) => r);
            payload = {"result": item.length > 0 && item[0].currentQuantity > 0 ? item : `No hay productos en el carrito con el id ${itemId}`}
        }else{
            payload = {"result": cartItems}
        }
    }else{
        payload = {"result": `Carrito vacio!`}
    }
    res.json(payload);
});

cartEndpoints.post(["/agregar", "/add", "/agregar/:id", "/add/:id"], async (req, res) => { //"agregar" funciona como "update", xq tiene que modificar items en la db (agregar quantity y quitar stock)!
    let payload = {}
    const itemId = Number(req.params.id);
    if (!isNaN(itemId)){
        const itemToModify = await prodsdb.get(tableName, itemId);
        if (itemToModify){
            let [stock, quant] = [itemToModify[0].totalStock, itemToModify[0].currentQuantity]
            const result = await prodsdb.update(tableName, itemId, {"totalStock": stock - 1, "currentQuantity": quant + 1});
            payload = {"result": `item ${itemId} añadido exitosamente!`, change: [`available: ${stock} --> ${stock - 1}`, `in cart: ${quant} --> ${quant + 1}`]}
        }else{
            payload = {"result": `error agregando producto`}
            res.status("500");
        }
    }else{
        payload = {"result": `falta el id del producto a agregar al carrito`}
        res.status("500");
    }
    res.json(payload);
});

cartEndpoints.put(["/actualizar", "/update", "/actualizar/:id", "/update/:id"], async (req, res) => {
    let payload = {}
    const itemId = Number(req.params.id);
    if (!isNaN(itemId)){
        const itemData = req.body;
        console.log(itemData);
        if (itemData){ // si no esta vacio
            const result = await prodsdb.update(tableName, itemId, itemData);
            if (result){
                payload = {result: "success"}
            }else{
                payload = {result: result}
            }
        }else{
            payload = {
                result: "Error: no se pasaron parametros, o la solicitud no es valida",
                suppliedItem: itemData,
            }
            res.status("500");
        }
    }else{
        payload = {"result": `falta el id del producto a agregar al carrito`}
        res.status("500");
    }
    res.json(payload);
});

cartEndpoints.delete(["/borrar", "/delete", "/borrar/:id", "/delete/:id"], async (req, res) => { //"borrar" funciona como "update", xq tiene que modificar items en la db (quitar quantity y agregar stock)!
    let payload = {}
    const itemId = Number(req.params.id);
    if (!isNaN(itemId)){
        const itemToModify = await prodsdb.get(tableName, itemId);
        payload = {"result": `item ${itemId} eliminado exitosamente!`}
        if (itemToModify){
            let [stock, quant] = [itemToModify[0].totalStock, itemToModify[0].currentQuantity]
            const result = await prodsdb.update(tableName, itemId, {"totalStock": stock + 1, "currentQuantity": quant - 1});
            payload = {"result": `item ${itemId} añadido exitosamente!`, change: [`available: ${stock} --> ${stock + 1}`, `in cart: ${quant} --> ${quant - 1}`]}
        }else{
            payload = {"result": `error eliminando producto`}
            res.status("500");
        }
    }else{
        payload = {"result": `falta el id del producto a eliminar del carrito`}
        res.status("500");
    }
    res.json(payload);
});

export default cartEndpoints;
