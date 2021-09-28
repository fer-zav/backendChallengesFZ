import {ProductosMemDAO} from "./DAOs/memory.js";
import {ProductosFSDAO} from "./DAOs/fs.js";
import {ProductosMongoDAO} from "./DAOs/mongo.js";
import {ProductosSQLDAO} from "./DAOs/sql.js";
import {ProductosFirebase} from "./DAOs/firebase.js";
import path from "path";

export const TipoPersistencia = {
    Memoria: "MEM",
    FileSystem: "FS",
    SQL: "SQL",
    Mongo: "Mongo",
    Firebase: "FIREBASE",
}

export class ProductosFactoryDAO{
    static get = (tipo, local) => {
        switch (tipo) {
            case TipoPersistencia.FileSystem:
                const filePath = path.resolve("./src/models/products/DAOs/products.json"); // el __dirname y las direcciones relativas no funcionanba, asique... hardcoded much :shrug:
                return new ProductosFSDAO(filePath);
            case TipoPersistencia.SQL:
                return new ProductosSQLDAO(local); //true: dev, sqlite; false: stage, mysql/maria
            case TipoPersistencia.Mongo:
                return new ProductosMongoDAO(local); //true: local; false: atlas
            case TipoPersistencia.Firebase:
                return new ProductosFirebase();
            default:
                return new ProductosMemDAO();
        }
    }
}
