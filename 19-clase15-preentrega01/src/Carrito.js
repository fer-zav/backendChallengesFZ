class Carrito{
    _cart = [];
    __idx = 0;
    constructor(producto){
        if (producto && price && stock){
            this._cart.push({
                timestamp: new Date().getTime(),
                producto: {...producto},
                id: this.__idx++,
            });
        }else{
            console.log("Carrito vacio");
        }
    }

    getItems = () => {
        return this.__idx < 1 ? "Carrito vacio!" : this._cart;
    }

    getItem = (id) => {
        // console.log(id);
        // console.log(this.__idx)
        return this.__idx < 1 ?
            "Sin productos todavia!"
        : this._cart.filter((item) => item.id === id).length > 0 ?
            this._cart.filter((item) => item.id === id)[0]
        : false;
    }

    populateCart = (prod) => {
        return this._cart.push({
            id: this.__idx++,
            timestamp: prod.timestamp,
            quantity: prod.quantity,
            producto: {...prod.producto},
        });
    }

    addItem = (id) => {
        const prod = this.getItem(id);
        if (prod && typeof(prod) !== "string"){
            if (prod.producto.stock > 0){
                prod.producto.stock--;
                prod.quantity++;
                return true;
            }else{
                return `No hay mas stock disponible!`;
            }
        }else{
            return `${JSON.stringify(id)} no encontrado!`;
        }
    }

    deleteItem = (id) => {
        const prod = this.getItem(id);
        if (prod && typeof(prod) !== "string"){
            if (prod.quantity > 0){
                prod.producto.stock++;
                prod.quantity--;
                return true;
            }else{
                return false;
            }
        }else{
            return `${JSON.stringify(id)} no encontrado!`;
        }
    }

    showCart = () => {
        return this._cart.filter((i) => i.quantity > 0);
    }

    swapCart = (newCart) => {
        this._cart = newCart;
        this.__idx = newCart.length;
    }

}

export const Cart = new Carrito();