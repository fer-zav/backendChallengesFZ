import Items from "./Items.js";
import {Server} from "socket.io";
import {MDBService} from "./db/utils/mongoHandler.js";
import {denormalize, normalize, schema} from "normalizr";

export const Begin = (app) => {
    const tableName = "mensajes";
    const msgdb = (() => { //ya no se auto-ejecuta, feo hack, pero si no defaultea a la db de productos "/
        const msgdb = MDBService;
        msgdb.init(tableName);
        return msgdb
    });

    const io = new Server(app);
    const productos = new Items();
    const lz = (n) => n > 9 ? n : `0${n}`;
    const parseDBResponse = (dbResponse) => {
        // let date = new Date(Number(dbResponse.mensaje.createdAt));
        let date = new Date(Number(dbResponse.createdAt));
        const formatedDate = `${date.getFullYear()}/${lz(date.getMonth())}/${lz(date.getDay())} - ${lz(date.getHours())}:${lz(date.getMinutes())}:${lz(date.getSeconds())}`;
        // const payload = {
        //     id: dbResponse.mensaje.id,
        //     createdAt: formatedDate,
        //     nickname: dbResponse.mensaje.author.alias,
        //     profile: dbResponse.mensaje.author.avatar,
        //     msg: dbResponse.mensaje.text,
        // }
        const payload = {
            id: dbResponse._id,
            createdAt: formatedDate,
            nickname: dbResponse.author.alias,
            email: dbResponse.author.email,
            profile: dbResponse.author.avatar,
            msg: dbResponse.text,
        }
        return payload;
    }
    let msgCount = 0;

    const authorSchema = new schema.Entity("author", {}, {idAttribute: "id"});
    const mensajeSchema = new schema.Entity("mensaje", authorSchema, {idAttribute: "email"});
    const mensajesSchema = new schema.Array(mensajeSchema);

    const normalizeDBRes = (DBR) => {
        // const parsedDBR = ;
        // return normalize(parsedDBR, mensajesSchema);
        return normalize(DBR, mensajesSchema);
    }
    const denormalizeDBRes = (DBR) => {
        const normData = normalizeDBRes(DBR);
        console.log([normData.result, normData.entities]);
        return denormalize(normData.result, mensajesSchema, normData.entities);
    }

    io.on("connection", (socket) => {
        socket.on("add_prods", (p) => {
            productos.addItem(p);
            io.emit('list_update', productos.getItems()[productos.getItems().length - 1]);
        });

        socket.on('start_prods', async () => {
            const prods = productos.getItems();
            if (prods.length > 0){
                socket.emit("list_init", prods);
            }
            if (msgdb()){
                const payload = await msgdb().get()
                    .then((rows) => {
                        const subPayload = [];
                        rows.map(async (row) => {
                            subPayload.push(parseDBResponse({
                                _id: row.id,
                                author: row.author,
                                createdAt: row.createdAt,
                                text: row.text
                            }))
                            // subPayload.push(row);
                        });
                        console.log(subPayload);
                        return subPayload;
                    })
                    .catch((err) => console.log(err))
                    .finally();
                socket.emit("messages_init", payload);
                msgCount = payload.length;

                // console.log(JSON.stringify(payload, null, "\t"));
                // console.log("payload");
                console.log("normalized data");
                const normalized = normalizeDBRes(payload);
                console.log(JSON.stringify(normalized, null, "\t"));
                console.log("denormalized data");
                const depayload = denormalizeDBRes(normalized);
                console.log(JSON.stringify(depayload, null, "\t"));
                // throw "let's BREAK this"; // breakpoint 'manual'

                // await msgdb().get()
                //     .then((rows) => {
                //         const payload = [];
                //         rows.map(async (row) => {
                //             // console.log("row")
                //             // console.log(row)
                //             payload.push(parseDBResponse(row));
                //         });
                //         socket.emit("messages_init", payload);
                //         msgCount = payload.length;
                //     })
                //     .catch((err) => console.log(err))
                //     .finally();
            }else{
                console.error("FATAL ERROR: CAN'T FETCH MESSAGES FROM DB!")
            }
        });

        socket.on("new_message", (msg) => {
            const initID = 2111;
            if (msgdb()){
                msgdb().create({...msg, id: initID + msgCount}) // 2111 es el id del 1er mensaje, no encontre como hacerlo auto-incremental "/
                    .then(() => console.log("new message added"))
                    .catch((err) => console.log(err.toString()))
                    .finally(() => {
                        if (msgdb()){
                            msgdb().get(`${initID + msgCount}`)
                                .then((rows) => {
                                    const payload = [];
                                    rows.map((row) => {
                                        payload.push(parseDBResponse(row));
                                    });
                                    io.emit("push_new_message", payload);
                                })
                                .catch((err) => console.log(err))
                                .finally((q) => {
                                    msgCount++;
                                });
                        }else{
                            console.error("FATAL ERROR: CAN'T FETCH MESSAGES FROM DB!")
                        }
                    });
            }
        });
    });
    return io;
}
