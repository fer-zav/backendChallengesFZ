"use strict";
exports.__esModule = true;
exports.Resta = void 0;
var Resta = /** @class */ (function () {
    function Resta(num1, num2) {
        var _this = this;
        this.result = function () { return _this.num1 - _this.num2; };
        this.num1 = num1;
        this.num2 = num2;
    }
    return Resta;
}());
exports.Resta = Resta;
