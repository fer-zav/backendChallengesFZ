"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Items {
    constructor(title = "", price = "", thumbnail = "") {
        this._items = [];
        this.__idx = 0;
        this.getLastItemId = () => {
            return this.__idx;
        };
        this.getItems = () => {
            return this.__idx < 1 ? "Lista vacia!" : this._items;
        };
        this.getItem = (id) => {
            return this.__idx < 1 ?
                "Sin productos todavia!"
                : this._items.filter((item) => item.id === id).length > 0 ?
                    this._items.filter((item) => item.id === id)[0]
                    : `No existe el item con ID == ${id}`;
        };
        this.addItem = (obj) => {
            this._items.push({
                title: obj.title,
                price: obj.price,
                thumbnail: obj.thumbnail,
                id: this.__idx++,
            });
            console.log("Item agregado!");
        };
        this.modificarItem = (id, payload) => {
            if (this.__idx < 1) {
                return "Sin productos todavia!";
            }
            else {
                let newItem = Object.assign(Object.assign({}, payload), { id: id });
                this._items[this._items.indexOf(this._items.filter((item) => item.id === id)[0])] = newItem; //feo pero ya se sabe que existe el indice
                return newItem;
            }
        };
        this.eliminarItem = (id) => {
            const oldItem = this._items.filter((item) => item.id === id) ? this._items.filter((item) => item.id === id)[0] : false;
            if (oldItem) {
                this._items = this._items.filter((i) => i.id !== oldItem.id);
            }
            return oldItem;
        };
        if (title && price && thumbnail) {
            this._items.push({
                title: title,
                price: price,
                thumbnail: thumbnail,
                id: this.__idx++,
            });
        }
        else {
            console.log("Error: sin items que agregar!");
        }
    }
}
exports.default = Items;
