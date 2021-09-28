import {cartsAPI} from "../apis/carts.js";

class Carrito {
    checkCartExists = async (req, res, next) => {
        const id = req.params.id;
        const cart = await cartsAPI.getCarts(id);
        if (!cart) {
            return res.status(404).json({
                msg: "cart not found",
            });
        }
        next();
    }

    getCarts = async (req, res) => {
        const {id} = req.params;
        const {nombre, precio} = req.query;
        if (id) {
            return res.json({
                data: await cartsAPI.getCarts(id),
            });
        }
        const query = {};
        if (nombre) query.nombre = nombre.toString();
        if (precio) query.precio = Number(precio);
        if (Object.keys(query).length) {
            return res.json({
                data: await cartsAPI.query(query),
            });
        }
        res.json({
            data: await cartsAPI.getCarts(),
        });
    }

    addCarts = async (req, res) => {
        const id = req.params.id;
        const newItem = await cartsAPI.addCart(id);
        res.json({
            msg: newItem ? "item agregado al carrito con exito" : "Error agregando item al carrito",
            ...(newItem && {data: newItem}),
        });
    }

    updateCarts = async (req, res) => {// not really used in cart class;
        const id = req.params.id;
        const updatedItem = await cartsAPI.updateCart(id, req.body);
        res.json({
            msg: "actualizando carrito",
            data: updatedItem,
        });
    }

    deleteCarts = async (req, res) => {
        const id = req.params.id;
        const deletedItem = await cartsAPI.deleteCart(id);
        res.json({
            msg: deletedItem ? "item borrado del carrito" : "Error borrando item del carrito",
            ...(deletedItem && {data: deletedItem}),
        });
    }
}

export const cartController = new Carrito();
