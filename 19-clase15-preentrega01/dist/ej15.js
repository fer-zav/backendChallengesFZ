"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

var _express = _interopRequireDefault(require("express"));

var _wsEndpoints = _interopRequireDefault(require("./routes/wsEndpoints.js"));

var _path = _interopRequireDefault(require("path"));

var http = _interopRequireWildcard(require("http"));

var _libws = require("./libws.js");

var _serverChecker = _interopRequireDefault(require("./serverChecker.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var app = (0, _express["default"])();
var puerto = 8080;

var publicFolderPath = _path["default"].resolve("public");

app.use("/public", _express["default"]["static"](publicFolderPath));
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.set("views", "./views");
app.set("view engine", "ejs");
app.use("/api", _wsEndpoints["default"]);
var server = http.Server(app);
server.listen(puerto, function () {
  return console.log("Servidor HTTP escuchado @ puerto ".concat(server.address().port));
}).on("error", function (error) {
  return console.log("SERVER ERROR!: ".concat(error));
});
var wsServer = (0, _libws.Begin)(server);
wsServer.on("error", function (error) {
  return console.log("SERVER ERROR!: ".concat(error));
});
(0, _serverChecker["default"])();