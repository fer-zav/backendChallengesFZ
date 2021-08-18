const socket = io.connect(window.location.href.split("/api")[0], {forceNew: true});

socket.emit("start_prods");

socket.on("list_update", (productos) => {
    addEntry(productos);
});

socket.on("list_init", (productos) => {
    if (typeof(productos) !== "string"){ // si lalista esta vacia devuelve un string
        productos.forEach((prod) => {
            addEntry(prod);
        });
    }
});

const addEntry = (producto) => {
    const table = document.querySelector("#prodsTable");
    const newTr = document.createElement("tr");
    newTr.innerHTML = `
        <td>${producto.title}</td>
        <td>${producto.price}</td>
        <td>
            <img class="thumb" src="${producto.thumbnail}" />
        </td>
    `;
    table.querySelector("tbody").appendChild(newTr);
}
