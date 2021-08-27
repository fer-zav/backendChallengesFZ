"use strict";

var socket = io.connect(window.location.href.split("/api")[0], {
  forceNew: true
});

var addEntry = function addEntry(producto) {
  var table = document.querySelector("#prodsTable");
  var newTr = document.createElement("tr");
  newTr.innerHTML = "\n        <td>".concat(producto.title, "</td>\n        <td>").concat(producto.price, "</td>\n        <td>\n            <img class=\"thumb\" src=\"").concat(producto.thumbnail, "\" />\n        </td>\n    ");
  table.querySelector("tbody").appendChild(newTr);
};

socket.emit("start_prods");
socket.on("list_update", function (producto) {
  addEntry(producto);
});
socket.on("list_init", function (productos) {
  if (typeof productos !== "string") {
    //Si la lista esta vacia devuelve un string
    productos.forEach(function (prod) {
      addEntry(prod);
    });
  }
});
socket.on("mostrar_txt_file", function (arch) {
  if (arch) {
    html = arch.map(function (msg) {
      return "<div>\n                <span>[".concat(msg.date, "]</span>\n                <strong> --> ").concat(msg.auth, "</strong>\n                <span>:").concat(msg.text, "</span>\n            </div>");
    }).join(" ");
    document.getElementsByTagName("body")[0].innerHTML += html;
  }
});