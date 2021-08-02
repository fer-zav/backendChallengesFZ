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
}
