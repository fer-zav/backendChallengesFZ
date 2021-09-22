import {CarritoMemDAO} from "./DAOs/memory.js";
import {CarritoFSDAO} from "./DAOs/fs.js";
import {CarritoMongoDAO} from "./DAOs/mongo.js";
import {CarritoSQLDAO} from "./DAOs/sql.js";
import {CarritoFirebase} from "./DAOs/firebase.js";
import path from "path";

export const TipoPersistencia = {
    Memoria: "MEM",
    FileSystem: "FS",
    SQL: "SQL",
    Mongo: "Mongo",
    Firebase: "FIREBASE",
}

export class CarritoFactoryDAO{
    static get(tipo, local) {
        switch (tipo) {
            case TipoPersistencia.FileSystem:
                const filePath = path.resolve("./DAOs/products.json");
                return new CarritoFSDAO(filePath);
            case TipoPersistencia.SQL:
                return new CarritoSQLDAO(local); //true: dev, sqlite; false: stage, mysql/maria
            case TipoPersistencia.Mongo:
                return new CarritoMongoDAO(local); //true: local; false: atlas
            case TipoPersistencia.Firebase:
                return new CarritoFirebase();
            default:
                return new CarritoMemDAO();
        }
    }
}
