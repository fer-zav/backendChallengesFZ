// import knex from "knex";
// import dbConfig from "../../../knexfile.js";    // nunca quisieron funcionar "/
const {options} = require("../../../knexfile.js");
const knex = require("knex");


class MDB {
    constructor(){
        const environment = process.env.NODE_ENV || "staging";
        console.log(`SETTING ${environment} DB`);
        const connect = options[environment];
        this.connection = knex(connect);
    }

    init = (tableName) => {
        this.connection.schema.hasTable(tableName)
            .then((exists) => {
                if (!exists){
                    const msgsPayload = [
                        {nickname: "email1@provider.com", msg: "1st!", createdAt: new Date().getTime()},
                        {nickname: "email2@provider.com", msg: "2nd...", createdAt: new Date().getTime()},
                        {nickname: "email3@provider.com", msg: "mensaje con algo de contenido", createdAt: new Date().getTime()},
                        {nickname: "email4@provider.com", msg: "not error", createdAt: new Date().getTime()},
                    ]
                    this.connection.schema.createTable(tableName, (table) => {
                        table.increments("id");
                        table.string("nickname").notNullable();
                        table.string("msg").notNullable();
                        table.integer("createdAt").notNullable();
                    })
                        .then(() => console.log("table messages created."))
                        .catch((err) => console.log(`error detected: ${err.toString()}`))
                        .finally(() => this.connection.destroy());

                    this.connection(tableName).insert(msgsPayload)
                        .then(() => console.log("messages added."))
                        .catch((err) => console.log(err.toString()))
                        .finally(() => this.connection.destroy());
                }
            })
            .catch((err) => console.log(err))
            .finally();
    }

    get = (tableName, id) => {
        return id ? this.connection(tableName).where("id", id) : this.connection(tableName);
    }

    create = async (tableName, data) => {
        return this.connection(tableName).insert(data);
    }

    update = (tableName, id, data) => { //sin mucha utilidad para mensajes, pero bueno
        return this.connection(tableName).where("id", id).update(data);
    }

    delete = (tableName, id) => { //sin mucha utilidad para mensajes, pero bueno
        return this.connection(tableName).where("id", id).del();
    }
}

export const MessageDBService = new MDB();
