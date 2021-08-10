export default class Items{
    _items = [];
    __idx = 0;
    constructor(title, price, thumbnail){
        if (title && price && thumbnail){
            this._items.push({
                title: title,
                price: price,
                thumbnail: thumbnail,
                id: this.__idx++,
            });
        }else{
            console.log("Error: sin items que agregar!");
        }
    }

    getLastItemId = () => {
        return this.__idx;
    }

    getItems = () => {
        return this.__idx < 1 ? "Lista vacia!" : this._items;
    }

    getItem = (id) => {
        return this.__idx < 1 ?
            "Sin productos todavia!"
        : this._items.filter((item) => item.id === id).length > 0 ?
            this._items.filter((item) => item.id === id)[0]
        : `No existe el item con ID == ${id}`;
    }

    addItem = (obj) => {
        this._items.push({
            title: obj.title,
            price: obj.price,
            thumbnail: obj.thumbnail,
            id: this.__idx++,
        });
        console.log("Item agregado!");
    }

    modificarItem = (id, payload) => {
        if (this.__idx < 1){
            return "Sin productos todavia!"
        }else{
            return this._items.filter((item) => item.id === id)[0] = {...payload, id: id};
        }
    }

    eliminarItem = (id) => {
        const oldItem = this._items.filter((item) => item.id === id) ? this._items.filter((item) => item.id === id)[0] : false;
        if (oldItem){
            this._items = this._items.filter((i) => i.id !== oldItem.id);
        }
        return oldItem;
    }
}
