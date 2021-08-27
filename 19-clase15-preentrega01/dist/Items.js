"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var Items = function Items(title, price, thumbnail) {
  var _this = this;

  (0, _classCallCheck2["default"])(this, Items);
  (0, _defineProperty2["default"])(this, "_items", []);
  (0, _defineProperty2["default"])(this, "__idx", 0);
  (0, _defineProperty2["default"])(this, "getLastItemId", function () {
    return _this.__idx;
  });
  (0, _defineProperty2["default"])(this, "getItems", function () {
    return _this.__idx < 1 ? "Lista vacia!" : _this._items;
  });
  (0, _defineProperty2["default"])(this, "getItem", function (id) {
    return _this.__idx < 1 ? "Sin productos todavia!" : _this._items.filter(function (item) {
      return item.id === id;
    }).length > 0 ? _this._items.filter(function (item) {
      return item.id === id;
    })[0] : "No existe el item con ID == ".concat(id);
  });
  (0, _defineProperty2["default"])(this, "addItem", function (obj) {
    _this._items.push({
      title: obj.title,
      price: obj.price,
      thumbnail: obj.thumbnail,
      id: _this.__idx++
    });

    console.log("Item agregado!");
  });
  (0, _defineProperty2["default"])(this, "modificarItem", function (id, payload) {
    if (_this.__idx < 1) {
      return "Sin productos todavia!";
    } else {
      var newItem = _objectSpread(_objectSpread({}, payload), {}, {
        id: id
      });

      _this._items[_this._items.indexOf(_this._items.filter(function (item) {
        return item.id === id;
      })[0])] = newItem; //feo pero ya se sabe que existe el indice

      return newItem;
    }
  });
  (0, _defineProperty2["default"])(this, "eliminarItem", function (id) {
    var oldItem = _this._items.filter(function (item) {
      return item.id === id;
    }) ? _this._items.filter(function (item) {
      return item.id === id;
    })[0] : false;

    if (oldItem) {
      _this._items = _this._items.filter(function (i) {
        return i.id !== oldItem.id;
      });
    }

    return oldItem;
  });

  if (title && price && thumbnail) {
    this._items.push({
      title: title,
      price: price,
      thumbnail: thumbnail,
      id: this.__idx++
    });
  } else {
    console.log("Error: sin items que agregar!");
  }
};

exports["default"] = Items;