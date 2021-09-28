import {CarritoFactoryDAO} from "../models/cart/cart.factory.js";
import {TipoPersistencia} from "../models/cart/cart.factory.js";

const options = Object.keys(TipoPersistencia);
const tipo = TipoPersistencia[options[Math.floor(Math.random() * options.length)]];
console.log(`Cart: Hoy toca... ${tipo}!`)
const local = true;

class cartAPI{
    constructor(){
        this.carrito = CarritoFactoryDAO.get(tipo, local);
    }

    getCarts = async (id = undefined) => {
        return id ? this.carrito.get(id) : this.carrito.get();
    }

    addCart = async (id) => {
        return await this.carrito.add(id);
    }

    updateCart = async (id, productData) => {
        return await this.carrito.update(id, productData);
    }

    deleteCart = async (id) => {
        return await this.carrito.delete(id);
    }

    query = async (options) => {
        return await this.carrito.query(options);
    }
}

export const cartsAPI = new cartAPI();
