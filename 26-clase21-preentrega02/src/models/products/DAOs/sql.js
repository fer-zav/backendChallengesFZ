import knex from "knex";
import {options} from "../../../config/knexfile.js";

const tableName = "producto";

export class ProductosSQLDAO{
    productos = [];
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
                            {_id: "1", nombre: "lapiz", precio: 200},
                            {_id: "2", nombre: "cartuchera", precio: 250},
                            {_id: "3", nombre: "boligoma", precio: 260},
                        ];
                        this.connection.schema.createTable(tName, (table) => { // dejando la estructura como tal, por si despues se necesita cambiarse a esta
                            // table.increments("id");
                            table.increments("_id");
                            // table.bigInteger("timestamp").notNullable();
                            table.string("nombre").notNullable();
                            table.decimal("precio", 5, 2).notNullable();
                            // table.string("descripcion").notNullable();
                            // table.string("codigo").notNullable();
                            // table.string("foto").notNullable();
                            // table.integer("totalStock").notNullable();
                            // table.integer("currentQuantity").notNullable();
                        })
                            .then(() => console.log("table products created."))
                            .catch((err) => console.log(`error detected: ${err.toString()}`))
                            .finally(() => this.connection.destroy());

                        this.connection(tName).insert(mockData)
                            .then(() => console.log("products added."))
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

    add = async (data) => {
        if (!data.nombre || !data.precio) throw new Error("invalid data");
        await this.connection(tableName).insert(data);
        const newId = await this.connection(tableName).select("_id")
        return this.connection(tableName).where("_id", newId[newId.length - 1]._id);
    }

    update = async (id, newProductData) => {
        await this.connection(tableName).where("_id", id).update(newProductData);
        return this.connection(tableName).where("_id", id);
    }

    delete = async (id) => {
        const newId = await this.connection(tableName).where("_id", id);
        newId.length > 0 ? await this.connection(tableName).where("_id", id).del() : console.log(`id ${id} not found!`);
        return;
    }

    query = async (options) => {
        let query = {};
        if (options.nombre) query.nombre = options.nombre;
        if (options.precio) query.precio = options.precio;
        return this.connection(tableName).where(query);
    }
}
