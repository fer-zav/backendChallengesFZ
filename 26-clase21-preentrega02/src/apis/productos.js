import {ProductosFactoryDAO} from "../models/products/products.factory.js";
import {TipoPersistencia} from "../models/products/products.factory.js";

const options = Object.keys(TipoPersistencia);
const tipo = TipoPersistencia[options[Math.floor(Math.random() * options.length)]];
console.log(`Products: Hoy toca... ${tipo}!`)
const local = true;

class prodAPI{
    constructor(){
        this.productos = ProductosFactoryDAO.get(tipo, local);
    }

    getProducts = async (id = undefined) => {
        return id ? this.productos.get(id) : this.productos.get();
    }

    addProduct = async (productData) => {
        return await this.productos.add(productData);
    }

    updateProduct = async (id, productData) => {
        return await this.productos.update(id, productData);
    }

    deleteProduct = async (id) => {
        await this.productos.delete(id);
    }

    query = async (options) => {
        return await this.productos.query(options);
    }
}

export const productsAPI = new prodAPI();
