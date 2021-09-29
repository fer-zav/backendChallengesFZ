// const Mongoose = require("mongoose");
import Mongoose from "mongoose";

const mensajesCollection = "mensajes";
// const mensajesSchema = new Mongoose.Schema({
//     id: {type: String, required: true, max: 50},
//     nickname: {type: String, required: true, max: 50},
//     msg: {type: String, required: true, max: 250},
//     createdAt: {type: Number, required: true},
// });
const mensajesSchema = new Mongoose.Schema({
    mensaje: {
        id: {type: Number, required: true},
        author: {
            id: {type: Number, required: true},
            nombre: {type: String, required: true, max: 250},
            apellido: {type: String, required: true, max: 250},
            edad: {type: Number, required: true},
            alias: {type: String, required: true, max: 250},
            avatar: {type: String, required: true, max: 2500},
        },
        createdAt: {type: String, required: true, max: 25},
        text: {type: String, max: 2500},
    }
});
export const mensajesModel = new Mongoose.model(mensajesCollection, mensajesSchema);
export const mdb = mensajesCollection;


const productosCollection = "productos";
const productosSchema = new Mongoose.Schema({
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
export const productosModel = new Mongoose.model(productosCollection, productosSchema);
export const pdb = productosCollection;
