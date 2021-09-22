import {ProductosFactoryDAO} from "../models/products/products.factory.js";
import {TipoPersistencia} from "../models/products/products.factory.js";

const tipo = TipoPersistencia.SQL;
const local = true;

class prodAPI{
    constructor(){
        this.productos = ProductosFactoryDAO.get(tipo, local);
    }

    async getProducts(id = undefined){
        return id ? this.productos.get(id) : this.productos.get();
    }

    async addProduct(productData){
        return await this.productos.add(productData);
    }

    async updateProduct(id, productData){
        return await this.productos.update(id, productData);
    }

    async deleteProduct(id){
        await this.productos.delete(id);
    }

    async query(options){
        return await this.productos.query(options);
    }
}

export const productsAPI = new prodAPI();
