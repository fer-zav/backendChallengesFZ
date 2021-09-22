import {productsAPI} from "../apis/productos.js";

class Producto {
    checkAddProducts(req, res, next) {
        const {nombre, precio} = req.body;
        if (!nombre || !precio || typeof nombre !== "string" || isNaN(precio)) {
            return res.status(400).json({
                msg: "Campos del body invalidos",
            });
        }
        next();
    }

    async checkProductExists(req, res, next) {
        const id = req.params.id;
        const producto = await productsAPI.getProducts(id);
        if (!producto) {
            return res.status(404).json({
                msg: "producto not found",
            });
        }
        next();
    }

    async getProducts(req, res) {
        const {id} = req.params;
        const {nombre, precio} = req.query;
        if (id) {
            return res.json({
                data: await productsAPI.getProducts(id),
            });
        }
        const query = {};
        if (nombre) query.nombre = nombre.toString();
        if (precio) query.precio = Number(precio);
        if (Object.keys(query).length) {
            return res.json({
                data: await productsAPI.query(query),
            });
        }
        res.json({
            data: await productsAPI.getProducts(),
        });
    }

    async addProducts(req, res) {
        const newItem = await productsAPI.addProduct(req.body);
        res.json({
            msg: "producto agregado con exito",
            data: newItem,
        });
    }

    async updateProducts(req, res) {
        const id = req.params.id;
        const updatedItem = await productsAPI.updateProduct(id, req.body);
        res.json({
            msg: "actualizando producto",
            data: updatedItem,
        });
    }

    async deleteProducts(req, res) {
        const id = req.params.id;
        await productsAPI.deleteProduct(id);
        res.json({
            msg: "producto borrado",
        });
    }
}

export const productsController = new Producto();
