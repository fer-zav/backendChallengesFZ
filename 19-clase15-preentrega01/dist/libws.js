"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Begin = void 0;

var _Items = _interopRequireDefault(require("./Items.js"));

var _socket = require("socket.io");

var _fs = _interopRequireDefault(require("fs"));

var Begin = function Begin(app) {
  var _parseTmp$messages;

  var io = new _socket.Server(app);
  var productos = new _Items["default"]();
  var msgsFile = "./messages.txt";

  var tmpMsgs = _fs["default"].readFileSync(msgsFile, "utf-8");

  var parseTmp = JSON.parse(tmpMsgs.length > 0 ? tmpMsgs : "{}");
  var mensajes = ((_parseTmp$messages = parseTmp.messages) === null || _parseTmp$messages === void 0 ? void 0 : _parseTmp$messages.length) > 0 ? parseTmp : {
    messages: [{
      auth: "yo",
      text: "placeholder initial msg",
      date: new Date().getTime()
    }]
  };
  io.on("connection", function (socket) {
    socket.on("add_prods", function (p) {
      productos.addItem(p);
      io.emit('list_update', productos.getItems()[productos.getItems().length - 1]);
    });
    socket.on('start_prods', function (data) {
      var prods = productos.getItems();

      if (prods.length > 0) {
        socket.emit("list_init", prods);
      }

      socket.emit("messages_init", mensajes.messages); // socket.emit("mostrar_txt_file", mensajes.messages); //descomentar para emitir "mostrar_txt_file", del ws_main y mostrar asi el contenido del txt en el browser
    });
    socket.on("new_message", function (msg) {
      var _fs$writeFileSync, _fs$writeFileSync$cat;

      mensajes.messages.push(msg);
      io.emit("push_new_message", JSON.stringify(mensajes.messages));

      _fs["default"].truncateSync(msgsFile, 0); // borrar el archivo


      var fd = _fs["default"].openSync(msgsFile, "a");

      (_fs$writeFileSync = _fs["default"].writeFileSync(fd, JSON.stringify(mensajes), "utf-8")) === null || _fs$writeFileSync === void 0 ? void 0 : (_fs$writeFileSync$cat = _fs$writeFileSync["catch"](function (err) {
        console.log("error writing message data!", err);
      })) === null || _fs$writeFileSync$cat === void 0 ? void 0 : _fs$writeFileSync$cat["finally"](function () {
        if (fd !== undefined) {
          _fs["default"].closeSync(fd);
        }
      });
    });
  });
  return io;
};

exports.Begin = Begin;