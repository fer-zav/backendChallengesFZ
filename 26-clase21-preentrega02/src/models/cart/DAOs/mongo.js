import mongoose from "mongoose";
import {Config} from "../../../config/config.js";

const cartSchema = new mongoose.Schema({
    id: {type: String, required: true, max: 50},
    timestamp: {type: Number, required: true},
    nombre: {type: String, required: true, max: 200},
    precio: {type: Number, required: true},
    descripcion: {type: String, required: true, max: 1000},
    codigo: {type: String, required: true, max: 50, unique: true},
    foto: {type: String, required: true, max: 1000},
    totalStock: {type: Number, required: true},
    currentQuantity: {type: Number, required: true},
});

export class CarritoMongoDAO{
    constructor(local = false){
        console.log("CONECTANDO MONGO...");
        this.srv = local ? `mongodb://localhost:27017/${Config.MONGO_ATLAS_DBNAME}` : `mongodb+srv://${Config.MONGO_ATLAS_USER}:${Config.MONGO_ATLAS_PASSWORD}@${Config.MONGO_ATLAS_CLUSTER}/${Config.MONGO_ATLAS_DBNAME}?retryWrites=true&w=majority`;
        mongoose.connect(this.srv);
        this.cart = mongoose.model("cart", cartSchema);
        (async () => { //(init)();
            if ((await this.get("1")).length < 1){
                await this.cart.insertMany([
                    {id: '1', timestamp: new Date().getTime(), nombre: 'Sofa', precio: 105, descripcion: 'Sofa rojo', codigo: '123332', foto: 'https://image.flaticon.com/icons/png/512/123/123332.png', totalStock: 16, currentQuantity: 0, stock: 100},
                    {id: '2', timestamp: new Date().getTime(), nombre: 'Aspiradora', precio: 139, descripcion: 'Aspiradora Moderna', codigo: '123364', foto: 'https://image.flaticon.com/icons/png/512/123/123364.png', totalStock: 35, currentQuantity: 0, stock: 100},
                    {id: '3', timestamp: new Date().getTime(), nombre: 'Cuadro', precio: 1020, descripcion: 'Marco de madera!', codigo: '123344', foto: 'https://image.flaticon.com/icons/png/512/123/123344.png', totalStock: 49, currentQuantity: 0, stock: 100},
                ]);
                console.log("items agregados a la tabla");
            }
        })();
        console.log("CONECTADO!");
    }

    get = async (id) => {
        let output = [];
        if (id){
            const document = await this.cart.find({id: id}).exec();
            if (document.length > 0) output.push(document);
        }else{
            output = await this.cart.find();
        }
        return output;
    }

    add = async (id) => {
        if (id){
            const targetItem = await this.get(id);
            if (targetItem && targetItem[0].totalStock > 0){
                await this.cart.findByIdAndUpdate(id, {
                    totalStock: targetItem[0].totalStock - 1,
                    currentQuantity: targetItem[0].currentQuantity + 1
                });
                return await this.get(id);
            }
        }
        return false;
    }

    update = async (id, newProductData) => {
        undefined; // not implemented, since it's NOT used in cart class;
    }

    delete = async (id) => {
        if (id){
            const targetItem = await this.get(id);
            if (targetItem && targetItem[0].currentQuantity > 0){
                await this.cart.findByIdAndUpdate(id, {
                    totalStock: targetItem[0].totalStock + 1,
                    currentQuantity: targetItem[0].currentQuantity - 1
                });
                return await this.get(id);
            }
        }
        return false;
    }

    query = async (options) => {
        let query = {};
        if (options.nombre) query.nombre = options.nombre;
        if (options.precio) query.precio = options.precio;
        return this.cart.find(query);
    }
}
