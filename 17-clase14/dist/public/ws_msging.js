"use strict";

// usando objetos de ws_main, no hay necesidad de redeclarar!
// const socket = io.connect(window.location.href.split("/api")[0], {forceNew: true});
var addMessage = function addMessage(e) {
  e.preventDefault;
  var texto = document.querySelector("#msgTexto");
  var message = {
    auth: document.querySelector("#msgUsername").value,
    text: texto.value,
    date: new Date().getTime()
  };
  message.auth && message.text ? socket.emit("new_message", message) : false;
  texto.value = "";
  return false;
};

var lz = function lz(n) {
  return n > 9 || n.length > 9 ? n : "0".concat(n);
};

var lowCostRender = function lowCostRender(payload) {
  var html = payload.map(function (elem) {
    f = new Date(elem.date);
    return "<div>\n                <span class=\"timestamp\">[".concat(f.getFullYear(), "/").concat(lz(f.getMonth()), "/").concat(lz(f.getDay()), " - ").concat(lz(f.getHours()), ":").concat(lz(f.getMinutes()), ":").concat(lz(f.getSeconds()), "]</span>\n                <strong>").concat(elem.auth, "</strong>:\n                <span>").concat(elem.text, "</span>\n            </div>");
  }).join(" ");
  document.querySelector("#messages").innerHTML += html; // document.querySelector("html").scrollTo({top: 10000, left: 0, behavior: 'smooth'});

  document.querySelector("#messages").scrollTo({
    top: 10000,
    left: 0,
    behavior: 'smooth'
  });
};

socket.on("messages_init", function (msgs) {
  msgs.length > 0 ? lowCostRender(msgs) : false;
});
socket.on("push_new_message", function (newMsg) {
  var lastMsg = JSON.parse(newMsg)[JSON.parse(newMsg).length - 1];
  lowCostRender([lastMsg]);
});