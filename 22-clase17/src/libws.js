import Items from "./Items.js";
import {Server} from "socket.io";
import {MessageDBService} from "./db/utils/msgDbHandler.js";

export const Begin = (app) => {
    const tableName = "messages";
    const msgdb = MessageDBService;
    msgdb.init(tableName);

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

        socket.on('start_prods', () => {
            const prods = productos.getItems();
            if (prods.length > 0){
                socket.emit("list_init", prods);
            }
            if (msgdb){
                msgdb.get(tableName)
                    .then((rows) => {
                        const payload = [];
                        rows.map((row) => {
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
            if (msgdb){
                msgdb.create(tableName, msg)
                    .then(() => console.log("new message added"))
                    .catch((err) => console.log(err.toString()))
                    .finally(() => {
                        msgCount++;
                        if (msgdb){
                            msgdb.get(tableName, msgCount)
                                .then((rows) => {
                                    const payload = [];
                                    rows.map((row) => {
                                        payload.push(parseDBResponse(row));
                                    });
                                    console.log(payload);
                                    io.emit("push_new_message", payload);
                                })
                                .catch((err) => console.log(err))
                                .finally();
                        }else{
                            console.error("FATAL ERROR: CAN'T FETCH MESSAGES FROM DB!")
                        }
                    });
            }
        });
    });
    return io;
}
