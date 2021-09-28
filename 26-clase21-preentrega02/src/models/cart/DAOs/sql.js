import knex from "knex";
import {options} from "../../../config/knexfileCart.js";

const tableName = "carts";

export class CarritoSQLDAO{
    constructor(local = false){
        this.environment = local ? process.env.NODE_ENV || "development" : process.env.NODE_ENV || "staging";
        console.log(`SETTING ${this.environment} DB`);
        this.connect = options[this.environment];
        this.connection = knex(this.connect);
        ((tName) => { //init convertido en IIFE
            this.connection.schema.hasTable(tName)
                .then((exists) => {
                    if (!exists){
                        const mockData = [
                            {_id: 1, timestamp: new Date().getTime(), nombre: 'Sofa', precio: 105, descripcion: 'Sofa rojo', codigo: '123332', foto: 'https://image.flaticon.com/icons/png/512/123/123332.png', totalStock: 16, currentQuantity: 0},
                            {_id: 2, timestamp: new Date().getTime(), nombre: 'Aspiradora', precio: 139, descripcion: 'Aspiradora Moderna', codigo: '123364', foto: 'https://image.flaticon.com/icons/png/512/123/123364.png', totalStock: 35, currentQuantity: 0},
                            {_id: 3, timestamp: new Date().getTime(), nombre: 'Cuadro', precio: 1020, descripcion: 'Marco de madera!', codigo: '123344', foto: 'https://image.flaticon.com/icons/png/512/123/123344.png', totalStock: 49, currentQuantity: 0},
                        ];
                        this.connection.schema.createTable(tName, (table) => {
                            table.increments("_id");
                            table.bigInteger("timestamp").notNullable();
                            table.string("nombre").notNullable();
                            table.decimal("precio", 5, 2).notNullable();
                            table.string("descripcion").notNullable();
                            table.string("codigo").notNullable();
                            table.string("foto").notNullable();
                            table.integer("totalStock").notNullable();
                            table.integer("currentQuantity").notNullable();
                        })
                            .then(() => console.log("table carts created."))
                            .catch((err) => console.log(`error detected: ${err.toString()}`))
                            .finally(() => this.connection.destroy());

                        this.connection(tName).insert(mockData)
                            .then(() => console.log("carts added."))
                            .catch((err) => console.log(err.toString()))
                            .finally(() => this.connection.destroy());
                    }
                })
                .catch((err) => console.log(err))
                .finally(() => console.log(`env ${this.environment} sql connected!`))
        })(tableName);
    }

    get = async (id) => {
        return id ? this.connection(tableName).where("_id", id) : this.connection(tableName);
    }

    add = async (id) => {
        if (id){
            const targetItem = await this.get(id);
            let [stock, quant] = [targetItem[0].totalStock, targetItem[0].currentQuantity];
            if (stock > 0){
                const payload = {
                    totalStock: stock - 1,
                    currentQuantity: quant + 1,
                }
                await this.connection(tableName).where("_id", id).update(payload);
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
            let [stock, quant] = [targetItem[0].totalStock, targetItem[0].currentQuantity];
            if (quant > 0){
                const payload = {
                    totalStock: stock + 1,
                    currentQuantity: quant - 1,
                }
                await this.connection(tableName).where("_id", id).update(payload);
                return await this.get(id);
            }
        }
        return false;
    }

    query = async (options) => {
        let query = {};
        if (options.nombre) query.nombre = options.nombre;
        if (options.precio) query.precio = options.precio;
        return this.connection(tableName).where(query);
    }
}
