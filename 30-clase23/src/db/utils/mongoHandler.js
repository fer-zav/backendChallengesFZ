// const mongoose = require("mongoose");
// const {productosModel, mensajesModel, mdb, pdb} = require("../models/models.js");
import mongoose from "mongoose";
import faker from "faker";
import {productosModel, mensajesModel, mdb, pdb} from "../models/models.js";

class MDB {
    constructor(){
        const DB_NAME = "ecommerce";
        const URL = `mongodb://localhost:27017/${DB_NAME}`;
        let mc = mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected!");
        this.querytable = undefined;
        this.increment = 1;
    }

    init = async (tableName) => {
        if ([mdb, pdb].indexOf(tableName) > -1) {
            const f = [faker.name, faker.internet];
            this.querytable = tableName == mdb ? mensajesModel : productosModel;
            let payload = []
            if (tableName == mdb){
                payload = [
                    {author: {id: this.increment, email: f[1].email(), nombre: f[0].firstName(), apellido: f[0].lastName(), edad: 18, alias: f[1].userName(), avatar: "http://www.placecage.com/300/300"}, id: this.increment++, createdAt: `${(new Date().getTime())}`, text: `${faker.hacker.phrase()}`},
                    {author: {id: this.increment, email: f[1].email(), nombre: f[0].firstName(), apellido: f[0].lastName(), edad: 18, alias: f[1].userName(), avatar: "http://www.fillmurray.com/300/300"}, id: this.increment++, createdAt: `${(new Date().getTime())}`, text: `${faker.commerce.productDescription()}`},
                    {author: {id: this.increment, email: f[1].email(), nombre: f[0].firstName(), apellido: f[0].lastName(), edad: 18, alias: f[1].userName(), avatar: "http://www.placecage.com/c/300/300"}, id: this.increment++, createdAt: `${(new Date().getTime())}`, text: `${faker.hacker.phrase()}`},
                    {author: {id: this.increment, email: f[1].email(), nombre: f[0].firstName(), apellido: f[0].lastName(), edad: 18, alias: f[1].userName(), avatar: "http://www.fillmurray.com/g/300/300"}, id: this.increment++, createdAt: `${(new Date().getTime())}`, text: `${faker.commerce.productDescription()}`},
                ]
            }else if (tableName == pdb){
                payload = [
                    {id: '1', timestamp: 1631231271759, nombre: 'Sofa', precio: 105, descripcion: 'Sofa rojo', codigo: '123332', foto: 'https://image.flaticon.com/icons/png/512/123/123332.png', totalStock: 16, currentQuantity: 0, stock: 100},
                    {id: '2', timestamp: 1631231272759, nombre: 'Aspiradora', precio: 139, descripcion: 'Aspiradora Moderna', codigo: '123364', foto: 'https://image.flaticon.com/icons/png/512/123/123364.png', totalStock: 35, currentQuantity: 0, stock: 100},
                    {id: '3', timestamp: 1631231273759, nombre: 'Cuadro', precio: 1020, descripcion: 'Marco de madera!', codigo: '123344', foto: 'https://image.flaticon.com/icons/png/512/123/123344.png', totalStock: 49, currentQuantity: 0, stock: 100},
                    {id: '4', timestamp: 1631231274759, nombre: 'Cama', precio: 1625, descripcion: 'Cama de de 2 plazas', codigo: '123333', foto: 'https://image.flaticon.com/icons/png/512/123/123333.png', totalStock: 59, currentQuantity: 0, stock: 100},
                    {id: '5', timestamp: 1631231275759, nombre: 'Estante', precio: 2618, descripcion: 'Estante (cactus se vende por separado)', codigo: '123359', foto: 'https://image.flaticon.com/icons/png/512/123/123359.png', totalStock: 62, currentQuantity: 0, stock: 100},
                    {id: '6', timestamp: 1631231276759, nombre: 'Lampara', precio: 2759, descripcion: "Lampara de techo 'medio-huevo'", codigo: '123341', foto: 'https://image.flaticon.com/icons/png/512/123/123341.png', totalStock: 72, currentQuantity: 0, stock: 100},
                    {id: '7', timestamp: 1631231277759, nombre: 'Maquina de coser', precio: 3597, descripcion: 'Maquina de coser azul', codigo: '123334', foto: 'https://image.flaticon.com/icons/png/512/123/123334.png', totalStock: 72, currentQuantity: 0, stock: 100},
                    {id: '8', timestamp: 1631231278759, nombre: 'Lavarropas', precio: 3666, descripcion: 'Lavarropas frontal clasico', codigo: '123318', foto: 'https://image.flaticon.com/icons/png/512/123/123318.png', totalStock: 74, currentQuantity: 0, stock: 100},
                    {id: '10', timestamp: 1631231280759, nombre: 'Microondas', precio: 4990, descripcion: 'Microondas blanco', codigo: '123351', foto: 'https://image.flaticon.com/icons/png/512/123/123351.png', totalStock: 96, currentQuantity: 0, stock: 100,quantity: 0},
                    {id: '11', timestamp: 1631234914629, nombre: '', precio: 2677, descripcion: '', codigo: '', foto: '', totalStock: 30, currentQuantity: 0, stock: 100}
                ]
            }
            payload.forEach(async (entry) => {
                // let realId = `${entry.id}`;
                const query = await this.querytable.find({id: "1"}).then((q) => q);
                if (query.length < 1){
                    const newEntry = new this.querytable(entry);
                    let saveEntry = await newEntry.save();
                }
            });
            console.log(`Finalizada la carga de ${tableName}`);
        }else{
            console.log(`Tabla ${tableName} no encontrada!`);
        }
    }

    get = async (id) => {
        return id ? this.querytable.find({id: id}, {_id: 0, __v: 0}).then((q) => q) : this.querytable.find({}, {_id: 0, __v: 0}).then((q) => q);
    }

    create = async (data) => {
        const newEntry = new this.querytable(data);
        let saveEntry = await newEntry.save();
        return await newEntry;
    }

    update = async (id, data) => {
        return id ? this.querytable.updateOne({id: id}, data) : false;
    }

    delete = async (id) => {
        return id ? this.querytable.deleteOne({id: id}) : false;
    }
}

export const MDBService = new MDB();
