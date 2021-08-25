import Items from "./Items.js";
import {Server} from "socket.io";
import * as fs from 'fs';

export const Begin = (app: any) => {
    const io = new Server(app);
    const productos = new Items();
    const msgsFile = "./messages.txt"
    const tmpMsgs = fs.readFileSync(msgsFile, "utf-8");
    const parseTmp = JSON.parse(tmpMsgs.length > 0 ? tmpMsgs : "{}");
    const mensajes = parseTmp.messages?.length > 0 ? parseTmp : {messages: [{auth:"yo", text:"placeholder initial msg", date: new Date().getTime()}]};

    io.on("connection", (socket) => {

        socket.on("add_prods", (p: any) => {
            productos.addItem(p);
            io.emit('list_update', productos.getItems()[productos.getItems().length - 1]);
        });

        socket.on('start_prods', () => {
            const prods = productos.getItems();
            if (prods.length > 0){
                socket.emit("list_init", prods);
            }
            socket.emit("messages_init", mensajes.messages);
            // socket.emit("mostrar_txt_file", mensajes.messages); //descomentar para emitir "mostrar_txt_file", del ws_main y mostrar asi el contenido del txt en el browser
        });

        socket.on("new_message", (msg: String) => {
            mensajes.messages.push(msg)
            io.emit("push_new_message", JSON.stringify(mensajes.messages));
            fs.truncateSync(msgsFile, 0); // borrar el archivo
            let fd = fs.openSync(msgsFile, "a");
            try{
                fs.writeFileSync(fd, JSON.stringify(mensajes), "utf-8")
            }catch{
                console.log("error writing message data!")
            }finally{
                if (fd !== undefined){
                    fs.closeSync(fd);
                }
            }
        });

    });
    return io;
}
