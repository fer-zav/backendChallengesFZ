const socket = io.connect(window.location.href.split("/api")[0], {forceNew: true});

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

socket.emit("start_prods");

socket.on("list_update", (producto) => {
    addEntry(producto);
});

socket.on("list_init", (productos) => {
    if (typeof(productos) !== "string"){ // si lalista esta vacia devuelve un string
        productos.forEach((prod) => {
            addEntry(prod);
        });
    }
});

socket.on("mostrar_txt_file", async (arch) => {
    const payload = JSON.parse(arch).prductos;
    console.log(payload);
    document.getElementsByTagName("body")[0].innerHTML += payload.forEach((item) => {
        return `<div>
            <span>${item.algo}</span>
            <span>${item.price}</span>
            <span><img src="${item.thumbnail}" /></span>
            <span>${item.algo}</span>
        </div>`
    });
})