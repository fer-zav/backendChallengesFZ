class Carrito{
    _cart = [];
    __idx = 0;
    constructor(product){
        if (product && price && stock){
            this._cart.push({
                timestamp: new Date().getTime(),
                product: {...product},
                id: this.__idx++,
            });
        }else{
            console.log("Carrito vacio");
        }
    }

    getLastItemId = () => {
        return this.__idx;
    }

    getItems = () => {
        return this.__idx < 1 ? "Carrito vacio!" : this._cart;
    }

    getItem = (id) => {
        return this.__idx < 1 ?
            "Sin productos todavia!"
        : this._cart.filter((item) => item.id === id).length > 0 ?
            this._cart.filter((item) => item.id === id)[0]
        : false;
    }

    addItem = (prod) => {
        // const prod = this.getItem(id);
        // if (prod && typeof(prod) !== "string"){
        //     prod.product.stock--;
        //     prod.quantity++
            this._cart.push(prod);
        // }else{
        //     return `${id} no encontrado!`
        // }
    }

    deleteItem = (id) => {
        const oldItem = this._cart.filter((item) => item.id === id) ? this._cart.filter((item) => item.id === id)[0] : false;
        if (oldItem){
            this._cart = this._cart.filter((i) => i.id !== oldItem.id);
        }
        return oldItem;
    }

}

export const Cart = new Carrito();