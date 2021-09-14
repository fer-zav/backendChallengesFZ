// const mongoose = require("mongoose");
// const {productosModel, mensajesModel, mdb, pdb} = require("../models/models.js");
import mongoose from "mongoose";
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
    }

    init = async (tableName) => {
        if ([mdb, pdb].indexOf(tableName) > -1) {
            this.querytable = tableName == mdb ? mensajesModel : productosModel;
            let payload = []
            if (tableName == mdb){
                payload = [
                    {id: '2111', nickname: 'mail.realista@domain.com', msg: 'LOL', createdAt: 1631231365030},
                    {id: '2112', nickname: 'clever@bot.com', msg: "It's the eye of the tiger", createdAt: 1631231366030},
                    {id: '2113', nickname: 'mail.realista@domain.com', msg: 'And the thrill of the fight', createdAt: 1631231367030},
                    {id: '2114', nickname: 'clever@bot.com', msg: 'Risin up to the challenge', createdAt: 1631231368030},
                    {id: '2115', nickname: 'mail.realista@domain.com', msg: 'Of our rivals', createdAt: 1631231369030},
                    {id: '2116', nickname: 'clever@bot.com', msg: 'And in the masters chamber', createdAt: 1631231370030},
                    {id: '2117', nickname: 'mail.realista@domain.com', msg: 'I love that about you CleverBot. You can trully sing', createdAt: 1631231371030},
                    {id: '2118', nickname: 'clever@bot.com', msg: 'I do not love you', createdAt: 1631231372030},
                    {id: '2119', nickname: 'mail.realista@domain.com', msg: 'Thanks', createdAt: 1631231373030},
                    {id: '2120', nickname: 'clever@bot.com', msg: 'You are welcome', createdAt: 1631231374030}
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
                const query = await this.querytable.find({id: entry.id}).then((q) => q);
                if (!query){
                    const newEntry = new this.querytable(entry);
                    let saveEntry = await newEntry.save()
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
