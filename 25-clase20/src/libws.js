import Items from "./Items.js";
import {Server} from "socket.io";
// import {MessageDBService} from "./db/utils/msgDbHandler.js";
import {MDBService} from "./db/utils/mongoHandler.js";

export const Begin = (app) => {
    // const tableName = "messages";
    // const msgdb = MessageMDBService;
    const tableName = "mensajes";
    // const msgdb = MDBService;
    // msgdb.init(tableName);
    const msgdb = (() => { //ya no se auto-ejecuta, feo hack, pero si no defaultea a la db de productos "/
        const msgdb = MDBService;
        msgdb.init(tableName);
        return msgdb
    });

    const io = new Server(app);
    const productos = new Items();
    const lz = (n) => n > 9 ? n : `0${n}`;
    const parseDBResponse = (dbResponse) => {
        let date = new Date(dbResponse["createdAt"]);
        const formatedDate = `${date.getFullYear()}/${lz(date.getMonth())}/${lz(date.getDay())} - ${lz(date.getHours())}:${lz(date.getMinutes())}:${lz(date.getSeconds())}`;
        return {
            id: dbResponse["id"],
            createdAt: formatedDate,
            nickname: dbResponse["nickname"],
            msg: dbResponse["msg"],
        }
    }
    let msgCount = 0;

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
                // await msgdb().get(tableName)
                await msgdb().get()
                    .then((rows) => {
                        const payload = [];
                        rows.map(async (row) => {
                            // console.log("row")
                            // console.log(row)
                            payload.push(parseDBResponse(row));
                        });
                        socket.emit("messages_init", payload);
                        msgCount = payload.length;
                    })
                    .catch((err) => console.log(err))
                    .finally();
            }else{
                console.error("FATAL ERROR: CAN'T FETCH MESSAGES FROM DB!")
            }
            // socket.emit("mostrar_txt_file", mensajes.messages); //descomentar para emitir "mostrar_txt_file", del ws_main y mostrar asi el contenido del txt en el browser
        });

        socket.on("new_message", (msg) => {
            const initID = 2111;
            if (msgdb()){
                // msgdb().create(tableName, msg)
                msgdb().create({...msg, id: initID + msgCount}) // 2111 es el id del 1er mensaje, no encontre como hacerlo auto-incremental "/
                    .then(() => console.log("new message added"))
                    .catch((err) => console.log(err.toString()))
                    .finally(() => {
                        // msgCount++;
                        if (msgdb()){
                            // msgdb().get(tableName, msgCount)
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
