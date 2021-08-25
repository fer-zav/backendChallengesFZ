"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _http = _interopRequireDefault(require("http"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var serverChecker = function serverChecker() {
  var url = "127.0.0.1";
  var puerto = 8080;
  setTimeout( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var options, req;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            options = {
              hostname: url,
              port: puerto,
              path: '/api/productos/listar/',
              method: 'GET'
            };
            req = _http["default"].request(options, function (res) {
              res.on('data', function (d) {
                process.stdout.write(d);
              });
              process.stdout.write("\n");
            });
            req.on('error', function (error) {
              console.error(error);
            }).end();

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })), 1000);
  setTimeout( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var options, temp, i, req;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            options = {
              hostname: url,
              port: puerto,
              path: '/api/productos/listar/',
              method: 'GET'
            };
            temp = options.path;

            for (i = 0; i < 3; i++) {
              options.path = temp + i;
              req = _http["default"].request(options, function (res) {
                res.on('data', function (d) {
                  process.stdout.write(d);
                });
                process.stdout.write("\n");
              });
              req.on('error', function (error) {
                console.error(error);
              }).end();
            }

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })), 1500);
  setTimeout( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var itemPayload, options, req;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            itemPayload = JSON.stringify({
              "title": "Globo Terraqueo",
              "price": "345.67",
              "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-512.png"
            });
            options = {
              hostname: url,
              port: puerto,
              path: '/api/productos/guardar/',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Content-Length': itemPayload.length
              }
            };
            req = _http["default"].request(options, function (res) {
              res.on('data', function (d) {
                process.stdout.write(d);
              });
              process.stdout.write("\n");
            });
            req.on('error', function (error) {
              console.error(error);
            }).write(itemPayload);

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })), 2000);
  setTimeout( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var options, req;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            options = {
              hostname: url,
              port: puerto,
              path: '/api/productos/listar/',
              method: 'GET'
            };
            req = _http["default"].request(options, function (res) {
              res.on('data', function (d) {
                process.stdout.write(d);
              });
              process.stdout.write("\n");
            });
            req.on('error', function (error) {
              console.error(error);
            }).end();

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  })), 3000);
};

var _default = serverChecker;
exports["default"] = _default;