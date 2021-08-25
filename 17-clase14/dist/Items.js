"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Items = function Items(title, price, thumbnail) {
  var _this = this;

  _classCallCheck(this, Items);

  _defineProperty(this, "_items", []);

  _defineProperty(this, "__idx", 0);

  _defineProperty(this, "getLastItemId", function () {
    return _this.__idx;
  });

  _defineProperty(this, "getItems", function () {
    return _this.__idx < 1 ? "Lista vacia!" : _this._items;
  });

  _defineProperty(this, "getItem", function (id) {
    return _this.__idx < 1 ? "Sin productos todavia!" : _this._items.filter(function (item) {
      return item.id === id;
    }).length > 0 ? _this._items.filter(function (item) {
      return item.id === id;
    })[0] : "No existe el item con ID == ".concat(id);
  });

  _defineProperty(this, "addItem", function (obj) {
    _this._items.push({
      title: obj.title,
      price: obj.price,
      thumbnail: obj.thumbnail,
      id: _this.__idx++
    });

    console.log("Item agregado!");
  });

  _defineProperty(this, "modificarItem", function (id, payload) {
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

  _defineProperty(this, "eliminarItem", function (id) {
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