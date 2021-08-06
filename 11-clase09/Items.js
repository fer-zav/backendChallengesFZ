export default class Items{
    _items = [];
    constructor(title, price, thumbnail){
        if (title && price && thumbnail){
            this._items.push({
                title: title,
                price: price,
                thumbnail: thumbnail,
                id: this._items.length,
            });
        }else{
            console.log("Error: sin items que agregar!");
        }
    }

    getItems(){
        return this._items.length < 1 ? "Lista vacia!" : this._items;
    }

    getItem(id){
        return this._items.length < 1 ? "Sin productos todavia!" : this._items[id];
    }

    addItem(obj){
        this._items.push({...obj, id: this._items.length});
        console.log("Item agregado!");
    }

    modificarItem(id, payload){
        if (this._items.length < 1){
            return "Sin productos todavia!"
        }else{
            return this._items[id] = {...payload, id: id};
        }
    }

    eliminarItem(id){
        const oldItem = this._items[id].id === id ? this._items[id] : false;
        if (oldItem){
            this._items = this._items.filter((i) => i !== oldItem);
        }
        return oldItem;
    }
}
