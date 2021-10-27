const {options} = require("../../../knexfile.js");
const knex = require("knex");

class PDB {
    constructor(){
        const environment = process.env.NODE_ENV || "development";
        console.log(`SETTING ${environment} DB`);
        const connect = options[environment];
        this.connection = knex(connect);
    }

    init = (tableName) => {
        this.connection.schema.hasTable(tableName)
            .then((exists) => {
                if (!exists){
                    const prodsPayload = [
                        {timestamp: new Date().getTime(), nombre: "Escuadra", precio: "123.45", descripcion: "", codigo: "598f5ef3f0d31cfc6743f79614b0c56e", /*ringo*/ foto: "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png", totalStock: 24, currentQuantity: 0},
                        {timestamp: new Date().getTime(),  nombre: "Calculadora", precio: "234.56", descripcion: "", codigo: "52a43bc4333b63e5cd9e952357795054", /*gala*/ foto: "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-512.png", totalStock: 65, currentQuantity: 0},
                        {timestamp: new Date().getTime(),  nombre: "Globo Terraqueo", precio: "345.67", descripcion: "", codigo: "450af2b7bcba942959eb8ab81a587c23", /*witchero*/ foto: "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-512.png", totalStock: 82, currentQuantity: 0},
                    ];
                    this.connection.schema.createTable(tableName, (table) => {
                        table.increments("id");
                        table.bigInteger("timestamp").notNullable();
                        table.string("nombre").notNullable();
                        table.decimal("precio", 5, 2).notNullable();
                        table.string("descripcion").notNullable();
                        table.string("codigo").notNullable();
                        table.string("foto").notNullable();
                        table.integer("totalStock").notNullable();
                        table.integer("currentQuantity").notNullable();
                    })
                        .then(() => console.log("table products created."))
                        .catch((err) => console.log(`error detected: ${err.toString()}`))
                        .finally(() => this.connection.destroy());

                    this.connection(tableName).insert(prodsPayload)
                        .then(() => console.log("products added."))
                        .catch((err) => console.log(err.toString()))
                        .finally(() => this.connection.destroy());
                }
            })
            .catch((err) => console.log(err))
            .finally()
    }

    get = (tableName, id) => {
        return id ? this.connection(tableName).where("id", id) : this.connection(tableName);
    }

    create = async (tableName, data) => {
        return this.connection(tableName).insert(data);
    }

    update = (tableName, id, data) => {
        return this.connection(tableName).where("id", id).update(data);
    }

    delete = (tableName, id) => {
        return this.connection(tableName).where("id", id).del();
    }
}

export const ProdsDBService = new PDB();
