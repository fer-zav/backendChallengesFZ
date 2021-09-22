import mongoose from "mongoose";
import {Config} from "../../../config/config.js";

const productsSchema = new mongoose.Schema({
    nombre: {type: String, required: true, max: 50},
    precio: {type: Number, required: true},
});

export class ProductosMongoDAO{
    srv = "";
    constructor(local = false){
        console.log("CONECTANDO MONGO...");
        this.srv = local ? `mongodb://localhost:27017/${Config.MONGO_ATLAS_DBNAME}` : `mongodb+srv://${Config.MONGO_ATLAS_USER}:${Config.MONGO_ATLAS_PASSWORD}@${Config.MONGO_ATLAS_CLUSTER}/${Config.MONGO_ATLAS_DBNAME}?retryWrites=true&w=majority`;
        mongoose.connect(this.srv);
        this.productos = mongoose.model("producto", productsSchema);
        console.log("CONECTADO!");
    }

    get = async (id) => {
        let output = [];
        if (id){
            const document = await this.productos.findById(id);
            if (document) output.push(document);
        }else{
            output = await this.productos.find();
        }
        return output;
    }

    add = async (data) => {
        if (!data.nombre || !data.precio) throw new Error("invalid data");
        const newProduct = new this.productos(data);
        await newProduct.save();
        return newProduct;
    }

    update = async (id, newProductData) => {
        return this.productos.findByIdAndUpdate(id, newProductData);
    }

    delete = async (id) => {
        await this.productos.findByIdAndDelete(id);
    }

    query = async (options) => {
        let query = {};
        if (options.nombre) query.nombre = options.nombre;
        if (options.precio) query.precio = options.precio;
        return this.productos.find(query);
    }
}
