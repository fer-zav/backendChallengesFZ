import Items from "./Items.js";
import {Server} from "socket.io";

export const Begin = (app) => {
    const io = new Server(app);
    const productos = new Items();

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
        });

    });
    return io;
}
