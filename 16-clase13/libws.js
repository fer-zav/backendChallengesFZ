import Items from "./Items.js";
import {Server} from "socket.io";
import fs from 'fs';

export const Begin = (app) => {
    const io = new Server(app);
    const productos = new Items();
    const messages = [{auth:"yo", text:"placeholder initial msg", date: new Date().getTime()}];

    io.on("connection", (socket) => {

        socket.on("add_prods", (p) => {
            productos.addItem(p);
            io.emit('list_update', productos.getItems()[productos.getItems().length - 1]);
        });

        socket.on('start_prods', (data) => {
            const prods = productos.getItems();
            if (prods.length > 0){
                socket.emit("list_init", prods);
            }
            socket.emit("messages_init", messages);
            socket.emit("mostrar_txt_file", fs.readFileSync("products.txt", "utf-8"));
        });

        socket.on("new_message", (msg) => {
            messages.push(msg)
            io.emit("push_new_message", msg);
        });

        socket.on('disconnect', function(data) {
            console.log('disconnect!');
            fs.appendFileSync("history.txt", messages, "utf-8");
        });

    });
    return io;
}
