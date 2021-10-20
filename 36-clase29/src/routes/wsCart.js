import express from 'express';
import {MDBService} from '../db/utils/mongoHandler.js';

const cartEndpoints = express.Router();

const tableName = "productos";
const prodsdb = (() => { //ya no se auto-ejecuta, feo hack, pero si no defaultea a la db de productos "/
    const prodsdb = MDBService;
    prodsdb.init(tableName);
    return prodsdb
});

cartEndpoints.get("/", (req, res) => {
    res.json({
        result: "Endpoint inicial!",
    });
});

cartEndpoints.get(["/listar", "/list", "/listar/:id", "/list/:id"], async (req, res) => { //si se llama por id SOLO muestra los items que tienen cantidad actual en el carrito
    let payload = {}
    const itemId = Number(req.params.id);
    const cartContent = prodsdb().get();
    const cartItems = await cartContent.then((r) => r);
    if (cartItems.length > 0){
        if (!isNaN(itemId)){
            const item = await prodsdb().get(itemId).then((q) => {
                payload = {"result": q.length > 0 && q[0].currentQuantity > 0 ? q : `No hay productos en el carrito con el id ${itemId}`}
            });
        }else{
            payload = {"result": cartItems}
        }
    }else{
        payload = {"result": `Carrito vacio!`}
    }
    await res.json(payload);
});

cartEndpoints.post(["/agregar", "/add", "/agregar/:id", "/add/:id"], async (req, res) => { //"agregar" funciona con "update", porque tiene que modificar items en la db simulando un carrito
    let payload = {}
    const itemId = Number(req.params.id);
    if (!isNaN(itemId)){
        const itemToModify = await prodsdb().get(itemId)
            .then(async (q) => {
                if (q){
                    let [stock, quant] = [q[0].totalStock, q[0].currentQuantity];
                    if (stock > 0){
                        const result = await prodsdb().update(itemId, {"totalStock": stock - 1, "currentQuantity": quant + 1})
                            .then(() => {
                                payload = {"result": `item ${itemId} añadido exitosamente!`, change: [`available: ${stock} --> ${stock - 1}`, `in cart: ${quant} --> ${quant + 1}`]}
                            })
                            .catch((err) => console.log(err))
                    }else{
                        payload = {"result": "error agregando producto", reason: "sin stock disponible"}
                        res.status("500");
                    }
                }else{
                    payload = {"result": `error agregando producto`}
                    res.status("500");
                }
            })
            .catch((err) => console.log(err))
    }else{
        payload = {"result": `falta el id del producto a agregar al carrito`}
        res.status("500");
    }
    await res.json(payload);
});

cartEndpoints.put(["/actualizar", "/update", "/actualizar/:id", "/update/:id"], async (req, res) => {
    let payload = {}
    const itemId = Number(req.params.id);
    if (!isNaN(itemId)){
        const itemData = req.body;
        console.log(itemData);
        if (itemData){
            const result = await prodsdb().update(itemId, itemData)
                .then((q) => {
                    payload = q.acknowledged ? {result: "success", changeItem: `item #${itemId} updated`} : {result: {changedItem: `${q.acknowledged}`}};
                })
                .catch((err) => console.log(err))
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
    await res.json(payload);
});

cartEndpoints.delete(["/borrar", "/delete", "/borrar/:id", "/delete/:id"], async (req, res) => { //"borrar" funciona con "update", porque tiene que modificar items en la db simulando un carrito
    let payload = {}
    const itemId = Number(req.params.id);
    if (!isNaN(itemId)){
        const itemToModify = await prodsdb().get(itemId)
            .then(async (q) => {
                if (q){
                    let [stock, quant] = [q[0].totalStock, q[0].currentQuantity];
                    if (quant > 0){
                        const result = await prodsdb().update(itemId, {"totalStock": stock + 1, "currentQuantity": quant - 1})
                            .then(() => {
                                payload = {"result": `item ${itemId} añadido exitosamente!`, change: [`available: ${stock} --> ${stock - 1}`, `in cart: ${quant} --> ${quant + 1}`]}
                            })
                            .catch((err) => console.log(err))
                    }else{
                        payload = {"result": "error agregando producto", reason: "item no encontrado en el carrito"}
                        res.status("500");
                    }
                }else{
                    payload = {"result": `error agregando producto`}
                    res.status("500");
                }
            })
            .catch((err) => console.log(err))
    }else{
        payload = {"result": `falta el id del producto a eliminar del carrito`}
        res.status("500");
    }
    res.json(payload);
});

export default cartEndpoints;
