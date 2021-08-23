const socket = io.connect(window.location.href.split("/api")[0], {forceNew: true});

const addEntry = (producto) => {
    const table = document.querySelector("#prodsTable");
    const newTr = document.createElement("tr").innerHTML = `
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
    if (typeof(productos) !== "string"){ //Si la lista esta vacia devuelve un string
        productos.forEach((prod) => {
            addEntry(prod);
        });
    }
});

socket.on("mostrar_txt_file", (arch) => {
    if (arch){
        html = arch.map((msg) =>
            `<div>
                <span>[${msg.date}]</span>
                <strong> --> ${msg.auth}</strong>
                <span>:${msg.text}</span>
            </div>`
        )
        .join(" ");
        document.getElementsByTagName("body")[0].innerHTML += html
    }
});
