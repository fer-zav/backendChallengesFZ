"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _express = _interopRequireDefault(require("express"));

var _Items = _interopRequireDefault(require("../Items.js"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var endpoints = _express["default"].Router(); // const productos = new Items();


var productos = new _Items["default"]("Escuadra", "123.45", "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png");
var item2 = {
  title: "Calculadora",
  price: "234.56",
  thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-512.png"
};
productos.addItem(item2);

var validateId = function validateId(id) {
  return !isNaN(id) ? id >= 0 ? id < productos.getLastItemId() ? true : "Error: no se encontro ningun producto con ID \"".concat(id, "\"!") : "Error: ID de producto no puede ser < 0!" : "Error: \"".concat(id, "\" es NaN!");
};

endpoints.get("/", function (req, res) {
  res.json({
    result: "Endpoint inicial!"
  });
});
endpoints.get("/productos", function (req, res) {
  res.json({
    result: "endpoint index!",
    get: [{
      url: "http://".concat(req.headers.host, "/api/"),
      description: "endpoint inicial"
    }, {
      url: "http://".concat(req.headers.host, "/api/productos"),
      description: "this"
    }, {
      url: "http://".concat(req.headers.host, "/api/productos/vista"),
      description: "representacion visual de los productos"
    }, {
      url: "http://".concat(req.headers.host, "/api/productos/listar"),
      description: "endpoint JSON de los productos"
    }, {
      url: "http://".concat(req.headers.host, "/api/productos/listar/{id}"),
      description: "endpoint JSON de un producto especifico"
    }, {
      url: "http://".concat(req.headers.host, "/api/productos/agregar"),
      description: "representacion visual para agregar un producto especifico"
    }],
    post: [{
      url: "http://".concat(req.headers.host, "/api/productos/guardar"),
      description: "endpoint para agregar un producto especifico"
    }],
    put: [{
      url: "http://".concat(req.headers.host, "/api/productos/actualizar/:id"),
      description: "endpoint para modificar un producto especifico"
    }],
    "delete": [{
      url: "http://".concat(req.headers.host, "/api/productos/borrar/:id"),
      description: "endpoint para eliminar un producto especifico"
    }]
  });
});
endpoints.get("/productos/vista", function (req, res) {
  var getProds = function getProds() {
    return _objectSpread({}, productos);
  };

  res.render('main', {
    "productos": getProds(),
    "cant": productos.getLastItemId(),
    layout: "index"
  });
});
endpoints.get("/productos/listar", function (req, res) {
  if (productos.getItems()) {
    res.json({
      result: productos.getItems()
    });
  } else {
    res.json({
      result: "Error: Lista de productos vacia!"
    });
  }
});
endpoints.get("/productos/listar/:id", function (req, res) {
  var id = Number(req.params.id);
  var result = validateId(id);

  if (typeof result !== "string") {
    res.json({
      result: productos.getItem(id)
    });
  } else {
    res.json({
      result: result
    });
  }
});
endpoints.get("/productos/agregar", function (req, res) {
  var getProds = function getProds() {
    return _objectSpread({}, productos);
  };

  res.render('form', {
    "productos": getProds(),
    "cant": productos.getLastItemId(),
    layout: "index"
  });
});
endpoints.post("/productos/guardar", function (req, res) {
  // console.log(req.headers.referer);
  var itemData = req.body;

  if (itemData !== null && itemData !== void 0 && itemData.title && itemData !== null && itemData !== void 0 && itemData.price && itemData !== null && itemData !== void 0 && itemData.thumbnail) {
    productos.addItem(itemData);
    res.json({
      result: "Exito!",
      id: productos.getLastItemId() - 1,
      newProdcut: itemData
    });
  } else {
    res.json({
      result: "Error: no se puede agregar un item invalido!",
      suppliedItem: itemData,
      validItemFormat: {
        title: "exampleTitle",
        price: "examplePrice",
        thumbnail: "exampleThumbnail"
      }
    });
  }
});
endpoints.put("/productos/actualizar/:id", function (req, res) {
  var id = Number(req.params.id);
  var itemData = req.body;

  if (itemData !== null && itemData !== void 0 && itemData.title && itemData !== null && itemData !== void 0 && itemData.price && itemData !== null && itemData !== void 0 && itemData.thumbnail) {
    var result = validateId(id);

    if (typeof result !== "string") {
      res.json({
        result: productos.modificarItem(id, itemData)
      });
    } else {
      res.json({
        result: result
      });
    }
  } else {
    res.json({
      result: "Error: no se puede actualizar un item invalido!",
      suppliedItem: itemData,
      validItemFormat: {
        title: "exampleTitle",
        price: "examplePrice",
        thumbnail: "exampleThumbnail"
      }
    });
  }
});
endpoints["delete"]("/productos/borrar/:id", function (req, res) {
  var id = Number(req.params.id);
  var result = validateId(id);

  if (typeof result !== "string" && typeof productos.getItem(id) !== "string") {
    // tanto el resultado como el lookup del item son NO string, quiere decir que alguno de los 2 (o ambos) esta/n correcto/s
    res.json({
      result: productos.eliminarItem(id)
    });
  } else {
    res.json({
      result: result === true ? productos.getItem(id) : result // si result tiene algun "insight" ademas de true, imprimirlo, si no, el output de llamar a getItem con id no encontrado!

    });
  }
});
var _default = endpoints;
exports["default"] = _default;